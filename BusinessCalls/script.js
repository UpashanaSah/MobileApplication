// ============================================================
// FIREBASE DATABASE VIEWER
// Demonstrates snapshot and childSnapshot
// ============================================================

import { ref, get, onValue } from "firebase/database";

// Read entire database once
function readEntireDatabase() {
  const rootRef = ref(db);

  get(rootRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        console.log("Database is empty");
        return;
      }

      console.log("====================================");
      console.log("ENTIRE DATABASE");
      console.log("====================================");

      // Snapshot contains entire database
      console.log(snapshot.val());

      console.log("====================================");
      console.log("TOP LEVEL NODES");
      console.log("====================================");

      // childSnapshot contains each child node
      snapshot.forEach((childSnapshot) => {
        console.log("Node Name:", childSnapshot.key);
        console.log("Node Data:", childSnapshot.val());
        console.log("------------------------------------");
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Read all posts
function readPosts() {
  const postsRef = ref(db, "posts");

  get(postsRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        console.log("No posts found");
        return;
      }

      console.log("====================================");
      console.log("POSTS");
      console.log("====================================");

      snapshot.forEach((childSnapshot) => {
        const post = childSnapshot.val();

        console.log("Firebase Key:", childSnapshot.key);
        console.log("Post ID:", post.id);
        console.log("Author:", post.author);
        console.log("Title:", post.title);
        console.log("Category:", post.cat);
        console.log("Likes:", post.likes);
        console.log("Comments:", post.comments);
        console.log("------------------------------------");
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// Read all conversations
function readConversations() {
  const conversationsRef = ref(db, "conversations");

  get(conversationsRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        console.log("No conversations found");
        return;
      }

      console.log("====================================");
      console.log("CONVERSATIONS");
      console.log("====================================");

      snapshot.forEach((conversationSnapshot) => {
        const conversation = conversationSnapshot.val();

        console.log("Conversation ID:", conversationSnapshot.key);
        console.log("Name:", conversation.name);
        console.log("Category:", conversation.cat);
        console.log("Online:", conversation.online);

        console.log("Messages:");

        conversationSnapshot
          .child("messages")
          .forEach((messageSnapshot) => {
            const msg = messageSnapshot.val();

            console.log("   Message Key:", messageSnapshot.key);
            console.log("   From:", msg.from);
            console.log("   Text:", msg.text);
            console.log("   Time:", msg.time);
            console.log("   ----------------");
          });

        console.log("====================================");
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// Read all bookings
function readBookings() {
  const bookingsRef = ref(db, "bookings");

  get(bookingsRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        console.log("No bookings found");
        return;
      }

      console.log("====================================");
      console.log("BOOKINGS");
      console.log("====================================");

      snapshot.forEach((childSnapshot) => {
        const booking = childSnapshot.val();

        console.log("Booking Key:", childSnapshot.key);
        console.log("Advisor:", booking.advisorName);
        console.log("Role:", booking.advisorRole);
        console.log("Date:", booking.date);
        console.log("Time:", booking.time);
        console.log("Rate:", booking.rate);
        console.log("------------------------------------");
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// Realtime listener for whole database
function watchDatabaseLive() {
  const rootRef = ref(db);

  onValue(rootRef, (snapshot) => {
    console.clear();

    console.log("🔥 DATABASE UPDATED");
    console.log("====================================");

    snapshot.forEach((childSnapshot) => {
      console.log("Node:", childSnapshot.key);
      console.log(childSnapshot.val());
      console.log("------------------------------------");
    });
  });
}

// ============================================================
// CALL FUNCTIONS
// ============================================================

readEntireDatabase();
readPosts();
readConversations();
readBookings();
watchDatabaseLive();
