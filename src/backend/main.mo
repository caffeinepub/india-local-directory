import Map "mo:core/Map";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Option {
    public func isSome<T>(option : ?T) : Bool {
      switch (option) {
        case (null) { false };
        case (?_) { true };
      };
    };

    public func isNull<T>(option : ?T) : Bool {
      switch (option) {
        case (null) { true };
        case (?_) { false };
      };
    };
  };

  module Listing {
    public type Listing = {
      id : Nat;
      name : Text;
      listingType : {
        #shop;
        #institution;
        #atm;
      };
      category : {
        #retail;
        #food;
        #healthcare;
        #education;
        #finance;
        #services;
        #other;
      };
      address : Text;
      city : Text;
      state : Text;
      pincode : Text;
      phone : Text;
      description : Text;
      rating : Float;
      totalRatings : Nat;
      openHours : Text;
      isActive : Bool;
    };

    public func compare(listing1 : Listing, listing2 : Listing) : Order.Order {
      Nat.compare(listing1.id, listing2.id);
    };
  };

  module ListingUpdateData {
    public type ListingUpdateData = {
      name : ?Text;
      listingType : ?{
        #shop;
        #institution;
        #atm;
      };
      category : ?{
        #retail;
        #food;
        #healthcare;
        #education;
        #finance;
        #services;
        #other;
      };
      address : ?Text;
      city : ?Text;
      state : ?Text;
      pincode : ?Text;
      phone : ?Text;
      description : ?Text;
      openHours : ?Text;
      isActive : ?Bool;
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let listings = Map.empty<Nat, Listing.Listing>();
  let listingRatings = Map.empty<Nat, Map.Map<Principal, Nat>>();
  var nextListingId = 1;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createListing(
    name : Text,
    listingType : {
      #shop;
      #institution;
      #atm;
    },
    category : {
      #retail;
      #food;
      #healthcare;
      #education;
      #finance;
      #services;
      #other;
    },
    address : Text,
    city : Text,
    state : Text,
    pincode : Text,
    phone : Text,
    description : Text,
    openHours : Text
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create listings");
    };

    let id = nextListingId;
    let listing : Listing.Listing = {
      id;
      name;
      listingType;
      category;
      address;
      city;
      state;
      pincode;
      phone;
      description;
      rating = 0.0;
      totalRatings = 0;
      openHours;
      isActive = true;
    };

    listings.add(id, listing);
    listingRatings.add(id, Map.empty<Principal, Nat>());
    nextListingId += 1;
    id;
  };

  public shared ({ caller }) func updateListing(id : Nat, updateData : ListingUpdateData.ListingUpdateData) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update listings");
    };

    let existingListing = switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };

    let newListing : Listing.Listing = {
      id = existingListing.id;
      name = switch (updateData.name) {
        case (null) { existingListing.name };
        case (?newName) { newName };
      };
      listingType = switch (updateData.listingType) {
        case (null) { existingListing.listingType };
        case (?newType) { newType };
      };
      category = switch (updateData.category) {
        case (null) { existingListing.category };
        case (?newCategory) { newCategory };
      };
      address = switch (updateData.address) {
        case (null) { existingListing.address };
        case (?newAddress) { newAddress };
      };
      city = switch (updateData.city) {
        case (null) { existingListing.city };
        case (?newCity) { newCity };
      };
      state = switch (updateData.state) {
        case (null) { existingListing.state };
        case (?newState) { newState };
      };
      pincode = switch (updateData.pincode) {
        case (null) { existingListing.pincode };
        case (?newPincode) { newPincode };
      };
      phone = switch (updateData.phone) {
        case (null) { existingListing.phone };
        case (?newPhone) { newPhone };
      };
      description = switch (updateData.description) {
        case (null) { existingListing.description };
        case (?newDescription) { newDescription };
      };
      rating = existingListing.rating;
      totalRatings = existingListing.totalRatings;
      openHours = switch (updateData.openHours) {
        case (null) { existingListing.openHours };
        case (?newOpenHours) { newOpenHours };
      };
      isActive = switch (updateData.isActive) {
        case (null) { existingListing.isActive };
        case (?newActive) { newActive };
      };
    };

    listings.add(id, newListing);
  };

  public shared ({ caller }) func deleteListing(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete listings");
    };

    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?_) {
        listings.remove(id);
        listingRatings.remove(id);
      };
    };
  };

  public query ({ caller }) func getListing(id : Nat) : async ?Listing.Listing {
    listings.get(id);
  };

  public query ({ caller }) func getAllActiveListings() : async [Listing.Listing] {
    listings.values().filter(
      func(listing) {
        listing.isActive;
      }
    ).toArray().sort();
  };

  public query ({ caller }) func searchListings(
    keyword : Text,
    listingTypeFilter : ?{ #shop; #institution; #atm },
    categoryFilter : ?{
      #retail;
      #food;
      #healthcare;
      #education;
      #finance;
      #services;
      #other;
    },
    cityFilter : ?Text
  ) : async [Listing.Listing] {
    let lowerKeyword = keyword.toLower();
    let filtered = listings.values().filter(
      func(listing) {
        if (not listing.isActive) {
          return false;
        };

        let matchesKeyword = listing.name.toLower().toText().contains(
          #text(
            lowerKeyword
          )
        ) or listing.description.toLower().toText().contains(
          #text(
            lowerKeyword
          )
        ) or listing.address.toLower().toText().contains(
          #text(
            lowerKeyword
          )
        );

        let matchesType = switch (listingTypeFilter) {
          case (null) { true };
          case (?filterType) {
            listing.listingType == filterType;
          };
        };

        let matchesCategory = switch (categoryFilter) {
          case (null) { true };
          case (?filterCategory) {
            listing.category == filterCategory;
          };
        };

        let matchesCity = switch (cityFilter) {
          case (null) { true };
          case (?filterCity) {
            listing.city.toLower() == filterCity.toLower();
          };
        };

        matchesKeyword and matchesType and matchesCategory and matchesCity;
      }
    ).toArray();

    filtered.sort();
  };

  public shared ({ caller }) func rateListing(listingId : Nat, rating : Nat) : async () {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let listing = switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) { listing };
    };

    if (not listing.isActive) {
      Runtime.trap("Cannot rate inactive listing");
    };

    let currentRatings = switch (listingRatings.get(listingId)) {
      case (null) { Map.empty<Principal, Nat>() };
      case (?ratings) { ratings };
    };

    let existingRating = switch (currentRatings.get(caller)) {
      case (null) { 0 };
      case (?r) { r };
    };

    let totalRatings = currentRatings.size();
    let currentTotalSum = totalRatings * Int.abs(
      listing.rating.toInt()
    );
    let newTotalSum = if (existingRating == 0) {
      currentTotalSum + rating;
    } else {
      currentTotalSum - existingRating + rating;
    };

    let newTotalRatings = if (existingRating == 0) {
      totalRatings + 1;
    } else {
      totalRatings;
    };

    currentRatings.add(caller, rating);
    listingRatings.add(listingId, currentRatings);

    let updatedListing : Listing.Listing = {
      id = listing.id;
      name = listing.name;
      listingType = listing.listingType;
      category = listing.category;
      address = listing.address;
      city = listing.city;
      state = listing.state;
      pincode = listing.pincode;
      phone = listing.phone;
      description = listing.description;
      rating = newTotalSum.toFloat() / newTotalRatings.toFloat();
      totalRatings = newTotalRatings;
      openHours = listing.openHours;
      isActive = listing.isActive;
    };

    listings.add(listingId, updatedListing);
  };

  [
    {
      name = "Fancy Bazar General Store";
      listingType = #shop;
      category = #retail;
      address = "12, Fancy Bazar Main Road";
      city = "Guwahati";
      state = "Assam";
      pincode = "781001";
      phone = "+91 98540 11234";
      description = "One of Guwahati's oldest and most trusted general stores in the heart of Fancy Bazar. Stocks groceries, household items, stationery, and daily essentials.";
      openHours = "Mon-Sat: 8:00 AM - 9:00 PM, Sun: 9:00 AM - 6:00 PM";
    },
    {
      name = "Downtown Hospital";
      listingType = #institution;
      category = #healthcare;
      address = "Dispur, GS Road";
      city = "Guwahati";
      state = "Assam";
      pincode = "781006";
      phone = "+91 361 233 6789";
      description = "One of Assam's leading multi-specialty hospitals offering cardiology, orthopaedics, neurology, oncology, and emergency services with state-of-the-art facilities.";
      openHours = "Emergency: 24 Hours | OPD: Mon-Sat 8:00 AM - 7:00 PM";
    },
    {
      name = "SBI ATM - Paltan Bazar";
      listingType = #atm;
      category = #finance;
      address = "Paltan Bazar, near Railway Station";
      city = "Guwahati";
      state = "Assam";
      pincode = "781008";
      phone = "+91 361 254 0000";
      description = "State Bank of India ATM near Guwahati Railway Station. Supports cash withdrawal, balance inquiry, mini statement, and PIN change. Accepts RuPay, Visa, Mastercard.";
      openHours = "Open 24 Hours";
    },
    {
      name = "Cotton University";
      listingType = #institution;
      category = #education;
      address = "Panbazar, Ambari";
      city = "Guwahati";
      state = "Assam";
      pincode = "781001";
      phone = "+91 361 254 4746";
      description = "One of the oldest and most prestigious universities in Northeast India, offering undergraduate and postgraduate programs in arts, science, and commerce.";
      openHours = "Mon-Fri: 9:00 AM - 5:00 PM";
    },
    {
      name = "Paradise Restaurant";
      listingType = #shop;
      category = #food;
      address = "MG Road, Uzanbazar";
      city = "Guwahati";
      state = "Assam";
      pincode = "781001";
      phone = "+91 98642 22345";
      description = "A Guwahati institution serving authentic Assamese thalis, fish curries, and local delicacies for over 30 years. Popular with locals and tourists alike.";
      openHours = "Daily: 8:00 AM - 10:00 PM";
    },
    {
      name = "HDFC Bank ATM - GS Road";
      listingType = #atm;
      category = #finance;
      address = "GS Road, Bhangagarh";
      city = "Guwahati";
      state = "Assam";
      pincode = "781005";
      phone = "+91 361 246 0000";
      description = "HDFC Bank ATM on the busy GS Road corridor. Supports cash withdrawal, account balance check, and mini-statement. All major card networks accepted.";
      openHours = "Open 24 Hours";
    },
    {
      name = "Purvi Northeast Handicrafts";
      listingType = #shop;
      category = #retail;
      address = "Lal Ganesh, Zoo Road";
      city = "Guwahati";
      state = "Assam";
      pincode = "781005";
      phone = "+91 94351 67890";
      description = "Showcasing authentic handloom textiles, bamboo crafts, cane products, and traditional jewellery from across the Northeast. A must-visit for souvenirs and gifts.";
      openHours = "Mon-Sat: 10:00 AM - 8:00 PM";
    },
    {
      name = "Gauhati High Court";
      listingType = #institution;
      category = #services;
      address = "Fancy Bazar, High Court Road";
      city = "Guwahati";
      state = "Assam";
      pincode = "781001";
      phone = "+91 361 254 0600";
      description = "The High Court of Assam, Nagaland, Mizoram, and Arunachal Pradesh. Handles civil, criminal, and constitutional matters for the Northeast region.";
      openHours = "Mon-Fri: 10:30 AM - 4:30 PM (Court Hours)";
    }
  ].forEach(
    func(listing) {
      let id = nextListingId;
      listings.add(
        id,
        {
          id;
          name = listing.name;
          listingType = listing.listingType;
          category = listing.category;
          address = listing.address;
          city = listing.city;
          state = listing.state;
          pincode = listing.pincode;
          phone = listing.phone;
          description = listing.description;
          rating = 0.0;
          totalRatings = 0;
          openHours = listing.openHours;
          isActive = true;
        },
      );
      listingRatings.add(id, Map.empty<Principal, Nat>());
      nextListingId += 1;
    }
  );
};
