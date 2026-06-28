import { initializeApp }    from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, push, set, get, onValue, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCdedy6JrM7SFP2bvTS035AvbrZf3x06Ew",
  authDomain:        "mobileapplication-b0aec.firebaseapp.com",
  databaseURL:       "https://mobileapplication-b0aec-default-rtdb.firebaseio.com",
  projectId:         "mobileapplication-b0aec",
  storageBucket:     "mobileapplication-b0aec.firebasestorage.app",
  messagingSenderId: "347418452781",
  appId:             "1:347418452781:web:12cc1079d54fbd8fd9a9a4",
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// ============================================================
// Seed data (written to Firebase on first load if empty)
// ============================================================
const SEED_POSTS = [
  { id:"p1", author:"Sasha Kim",   role:"COO · TechFlow",          color:"#6c63b6", initials:"SK", cat:"Finance",    likes:24, comments:8,  time:"2h",  title:"How do you manage burn-rate during a pivot?", body:"We've shifted focus twice in 18 months and the CFO is nervous. Any frameworks for communicating to investors while the runway shrinks?" },
  { id:"p2", author:"Marcus Reid", role:"Founder · GreenHaul",      color:"#c06c3e", initials:"MR", cat:"Legal",      likes:11, comments:3,  time:"5h",  title:"Freight broker licensing — do I really need it?", body:"Just expanded to cross-state delivery. Legal says yes, finance says it's not worth the cost right now. Looking for real-world experience." },
  { id:"p3", author:"Lena Torres", role:"VP Growth · Nimbus",       color:"#3e7c74", initials:"LT", cat:"Marketing",  likes:39, comments:14, time:"1d",  title:"CAC is up 3× since iOS 14 — what's working for you?", body:"Meta ads are still our biggest channel but attribution is completely broken. Thinking about shifting to influencer + affiliate. Thoughts?" },
  { id:"p4", author:"Dev Patel",   role:"CTO · Archly",             color:"#5a7db5", initials:"DP", cat:"Startup",   likes:7,  comments:2,  time:"2d",  title:"Hiring first engineer — equity split advice?", body:"Solo technical founder here. About to bring on a full-stack dev as employee #1. What cliff/vesting terms are market-standard in 2024?" },
  { id:"p5", author:"Amy Chen",    role:"CEO · LunaBox",            color:"#a3445e", initials:"AC", cat:"Operations", likes:18, comments:6,  time:"3d",  title:"3PL vs in-house fulfillment at $2M ARR?", body:"We hit $2M ARR last quarter and our current 3PL margins are brutal. Is it too early to build our own mini-warehouse?" },
];

const SEED_ADVISORS = [
  { id:"a1", name:"Rachel Okonkwo", role:"Ex-McKinsey Strategy Lead",  color:"#6c63b6", initials:"RO", cat:"Strategy",      tags:["Strategy","M&A","OKRs"],       rating:4.9, sessions:214, rate:"$180", bio:"15 years advising Fortune 500 and Series-B startups on growth strategy and organisational design. Former McKinsey EM.",    reviews:[{name:"James L.", stars:5, text:"Rachel reframed our entire go-to-market in one session. Exceptional."},{name:"Priya M.", stars:5, text:"Incredibly structured thinking. Worth every penny."}] },
  { id:"a2", name:"Daniel Marsh",   role:"Venture Partner @ Seed+",    color:"#c06c3e", initials:"DM", cat:"Startup Mentor", tags:["Fundraising","Pitch","Cap Table"], rating:4.8, sessions:189, rate:"$220", bio:"Invested in 40+ startups across fintech and SaaS. Helps founders craft compelling narratives and nail due diligence.",     reviews:[{name:"Sofia K.", stars:5, text:"Helped me cut my deck from 20 slides to 10 and triple investor responses."},{name:"Tom A.", stars:4, text:"Super practical advice on SAFE terms."}] },
  { id:"a3", name:"Mira Hassan",    role:"CMO · 2 exits",              color:"#3e7c74", initials:"MH", cat:"Marketing",      tags:["Brand","Growth","SEO"],        rating:4.7, sessions:301, rate:"$150", bio:"Led marketing at two venture-backed startups through acquisition. Specialty in brand-led growth and community building.",   reviews:[{name:"Leo B.", stars:5, text:"Mira spotted positioning issues we'd been blind to for months."},{name:"Chloe P.", stars:4, text:"Great session on content flywheel strategy."}] },
  { id:"a4", name:"Ethan Novak",    role:"CFO-for-hire",               color:"#5a7db5", initials:"EN", cat:"Finance",        tags:["Fundraising","FP&A","Tax"],    rating:4.9, sessions:127, rate:"$200", bio:"Fractional CFO for 12 growth-stage companies. Expert in Series A/B financial modelling, unit economics, and investor relations.", reviews:[{name:"Ava R.", stars:5, text:"Ethan built our financial model from scratch in 2 sessions. Investors loved it."}] },
  { id:"a5", name:"Grace Liu",      role:"Partner · Meridian Legal",   color:"#a3445e", initials:"GL", cat:"Legal",          tags:["Contracts","IP","Corp"],       rating:4.8, sessions:98,  rate:"$250", bio:"Startup attorney specialising in incorporation, IP protection, and commercial contracts. Advised 80+ early-stage companies.", reviews:[{name:"Jake M.", stars:5, text:"Grace saved us from a terrible co-founder agreement. Essential."},{name:"Nina S.", stars:5, text:"Fast, clear, founder-friendly. Highly recommended."}] },
  { id:"a6", name:"Omar Syed",      role:"VP Sales · SaaS veteran",    color:"#6c63b6", initials:"OS", cat:"Sales",          tags:["SDR","Outbound","CRM"],        rating:4.7, sessions:176, rate:"$140", bio:"Built and scaled inside sales teams from 0 to $10M ARR three times. Coaches founders on hiring their first sales reps.",   reviews:[{name:"Dana C.", stars:5, text:"Omar's cold-email templates alone 4× our reply rate."}] },
  { id:"a7", name:"Yuki Tanaka",    role:"CTO · DevScale",             color:"#3e7c74", initials:"YT", cat:"Tech",           tags:["Architecture","Hiring","AI"],  rating:4.9, sessions:143, rate:"$190", bio:"Built engineering orgs from seed to Series C. Deep expertise in cloud architecture, technical hiring, and AI product strategy.", reviews:[{name:"Marcus T.", stars:5, text:"Yuki helped us halve our infra costs without touching the roadmap."}] },
]; 

const SEED_CONVERSATIONS = [
  { id:"c1", name:"Rachel Okonkwo", cat:"Strategy",      color:"#6c63b6", initials:"RO", online:true,  unread:2, time:"9:30", messages:[
    {from:"them", text:"Hi! I've reviewed your deck — your TAM slide needs work. Let's fix the bottom-up calc.", time:"9:28"},
    {from:"me",   text:"Agreed. I'll share the spreadsheet now.", time:"9:29"},
    {from:"them", text:"Also, slide 4 buries the lede. Lead with retention first.", time:"9:30"},
  ]},
  { id:"c2", name:"BizConnect Group", cat:"Community",  color:"#e2a33b", initials:"BC", online:false, unread:5, time:"Yesterday", messages:[
    {from:"them", text:"Anyone have experience with Stripe Atlas for Nepal-based founders?", time:"Tue"},
    {from:"me",   text:"Yes — took about 3 weeks for us. Happy to share docs.", time:"Tue"},
  ]},
  { id:"c3", name:"Daniel Marsh",    cat:"Fundraising", color:"#c06c3e", initials:"DM", online:true,  unread:0, time:"Mon", messages:[
    {from:"them", text:"Your Series A narrative is strong. Let's talk valuation anchoring next session.", time:"Mon"},
  ]},
];

// ============================================================
// Utility helpers
// ============================================================
function starsSVG(n) {
  return Array.from({length:5}, (_,i) => `
    <svg viewBox="0 0 24 24" fill="${i<n?'currentColor':'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>`).join("");
}

// ============================================================
// Seed Firebase with initial data (only if nodes are empty)
// ============================================================
async function seedIfEmpty() {
  const postsSnap  = await get(ref(db, "posts"));
  const advisSnap  = await get(ref(db, "advisors"));
  const convsSnap  = await get(ref(db, "conversations"));

  if (!postsSnap.exists()) {
    console.log("Seeding posts…");
    for (const p of SEED_POSTS) {
      await set(ref(db, `posts/${p.id}`), p);
    }
  }

  if (!advisSnap.exists()) {
    console.log("Seeding advisors…");
    for (const a of SEED_ADVISORS) {
      await set(ref(db, `advisors/${a.id}`), a);
    }
  }

  if (!convsSnap.exists()) {
    console.log("Seeding conversations…");
    for (const c of SEED_CONVERSATIONS) {
      await set(ref(db, `conversations/${c.id}`), c);
    }
  }

  console.log("Firebase seed check complete ✓");
}

// ============================================================
// State
// ============================================================
let allPosts        = [];
let allAdvisors     = [];
let allConversations= [];
let feedCat         = "All";
let advisorCat      = "All";
let currentAdvisor  = null;
let bookingState    = { advisorId:null, date:null, time:null };
let currentConvId   = null;
let screenStack     = [];
let isDark          = false;

// ============================================================
// Navigation
// ============================================================
function showScreen(name, pushStack = true) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.querySelector(`[data-screen="${name}"]`);
  if (!target) return;
  target.classList.add("active");
  if (pushStack) screenStack.push(name);

  // Sync tab bar
  const tabScreens = ["feed","marketplace","chat-list","profile"];
  document.querySelectorAll(".tab-item").forEach(t => {
    t.classList.toggle("active", t.dataset.tab === name);
  });
}

function goBack() {
  if (screenStack.length > 1) {
    screenStack.pop();
    showScreen(screenStack[screenStack.length-1], false);
  }
}

// Tab bar
document.querySelectorAll(".tab-item").forEach(btn => {
  btn.addEventListener("click", () => {
    screenStack = [];
    showScreen(btn.dataset.tab);
  });
});

// Back buttons
document.querySelectorAll("[data-back]").forEach(btn => {
  btn.addEventListener("click", goBack);
});

// ============================================================
// Theme
// ============================================================
function applyTheme(dark) {
  isDark = dark;
  document.getElementById("phone").setAttribute("data-theme", dark ? "dark" : "");
  document.getElementById("profile-theme-toggle").classList.toggle("on", dark);

  const icon = document.getElementById("theme-icon");
  icon.innerHTML = dark
    ? `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`
    : `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>`;
}

document.getElementById("theme-toggle").addEventListener("click", () => applyTheme(!isDark));
document.getElementById("profile-theme-toggle").addEventListener("click", () => applyTheme(!isDark));
document.getElementById("notif-toggle").addEventListener("click", function() { this.classList.toggle("on"); });

// ============================================================
// FEED
// ============================================================
function renderFeed() {
  const list    = document.getElementById("feed-list");
  const visible = feedCat === "All" ? allPosts : allPosts.filter(p => p.cat === feedCat);

  if (!visible.length) {
    list.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><h3>No posts yet</h3><p>Be the first to share a problem in this category.</p></div>`;
    return;
  }

  list.innerHTML = visible.map(p => `
    <div class="post-card">
      <div class="meta">
        <div class="avatar" style="background:${p.color}">${p.initials}</div>
        <div class="who">
          <div class="name">${p.author}</div>
          <div class="sub">${p.role} · ${p.time}</div>
        </div>
        <div class="cat-tag">${p.cat}</div>
      </div>
      <h3>${p.title}</h3>
      <p>${p.body}</p>
      <div class="post-actions">
        <button class="like-btn${p._liked?' liked':''}" data-id="${p.id}">
          <svg viewBox="0 0 24 24" fill="${p._liked?'currentColor':'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          ${p.likes}
        </button>
        <button>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${p.comments}
        </button>
        <div class="grow"></div>
        <button class="save-btn${p._saved?' saved':''}" data-id="${p.id}">
          <svg viewBox="0 0 24 24" fill="${p._saved?'currentColor':'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = allPosts.find(x => x.id === btn.dataset.id);
      if (!p) return;
      p._liked = !p._liked;
      p.likes  += p._liked ? 1 : -1;
      renderFeed();
    });
  });

  list.querySelectorAll(".save-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = allPosts.find(x => x.id === btn.dataset.id);
      if (!p) return;
      p._saved = !p._saved;
      renderFeed();
    });
  });
}

// Feed category chips
document.getElementById("feed-chips").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  feedCat = chip.dataset.cat;
  document.querySelectorAll("#feed-chips .chip").forEach(c => c.classList.toggle("active", c === chip));
  renderFeed();
});

// ============================================================
// COMPOSE MODAL
// ============================================================
let composeCat = "Startup";

document.getElementById("fab-compose").addEventListener("click", () => {
  document.getElementById("compose-overlay").classList.add("open");
});

document.getElementById("compose-close").addEventListener("click", () => {
  document.getElementById("compose-overlay").classList.remove("open");
});

document.getElementById("compose-overlay").addEventListener("click", e => {
  if (e.target === e.currentTarget) e.currentTarget.classList.remove("open");
});

document.getElementById("compose-cats").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  composeCat = chip.dataset.cat;
  document.querySelectorAll("#compose-cats .chip").forEach(c => c.classList.toggle("active", c === chip));
});

document.getElementById("compose-submit").addEventListener("click", async () => {
  const title = document.getElementById("compose-title").value.trim();
  const body  = document.getElementById("compose-body").value.trim();
  if (!title || !body) { alert("Please fill in both title and details."); return; }

  const newPost = {
    author:   "Jordan Lee",
    role:     "Founder · Northwind Robotics",
    color:    "#3e7c74",
    initials: "JL",
    cat:      composeCat,
    likes:    0,
    comments: 0,
    time:     "just now",
    title,
    body,
    createdAt: serverTimestamp(),
  };

  try {
    const postsRef = ref(db, "posts");
    const newRef   = push(postsRef);
    newPost.id     = newRef.key;
    await set(newRef, newPost);

    console.log("✅ Post saved to Firebase:", newPost);
    document.getElementById("compose-title").value = "";
    document.getElementById("compose-body").value  = "";
    document.getElementById("compose-overlay").classList.remove("open");
  } catch (err) {
    console.error("❌ Error saving post:", err);
    alert("Failed to post. Check console.");
  }
});

// ============================================================
// ADVISORS
// ============================================================
function renderAdvisors() {
  const list   = document.getElementById("advisor-list");
  const query  = document.getElementById("advisor-search").value.toLowerCase();
  let visible  = advisorCat === "All" ? allAdvisors : allAdvisors.filter(a => a.cat === advisorCat);
  if (query)  visible = visible.filter(a => a.name.toLowerCase().includes(query) || (a.tags||[]).join(" ").toLowerCase().includes(query));

  if (!visible.length) {
    list.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><h3>No advisors found</h3><p>Try a different search or category.</p></div>`;
    return;
  }

  list.innerHTML = visible.map(a => `
    <div class="advisor-card" data-id="${a.id}">
      <div class="main">
        <div class="top">
          <div class="avatar" style="background:${a.color}">${a.initials}</div>
          <div>
            <div class="name">${a.name}</div>
            <div class="role">${a.role}</div>
          </div>
        </div>
        <div class="tags">${(a.tags||[]).map(t=>`<div class="tag">${t}</div>`).join("")}</div>
        <div class="rating">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          ${a.rating} <span class="muted">· ${a.sessions} sessions</span>
        </div>
      </div>
      <div class="stub">
        <div class="rate">${a.rate}</div>
        <div class="rate-unit">/hr</div>
        <div class="book-label">Book</div>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".advisor-card").forEach(card => {
    card.addEventListener("click", () => openAdvisorDetail(card.dataset.id));
  });
}

document.getElementById("advisor-chips").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  advisorCat = chip.dataset.cat;
  document.querySelectorAll("#advisor-chips .chip").forEach(c => c.classList.toggle("active", c === chip));
  renderAdvisors();
});

document.getElementById("advisor-search").addEventListener("input", renderAdvisors);

// ============================================================
// ADVISOR DETAIL
// ============================================================
function openAdvisorDetail(id) {
  const a = allAdvisors.find(x => x.id === id);
  if (!a) return;
  currentAdvisor = a;

  document.getElementById("advisor-detail-rate").textContent = a.rate;
  document.getElementById("advisor-detail-content").innerHTML = `
    <div class="detail-hero">
      <div class="avatar lg" style="background:${a.color}">${a.initials}</div>
      <h2>${a.name}</h2>
      <div class="role">${a.role}</div>
      <div class="detail-stats">
        <div class="stat">
          <div class="num">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ${a.rating}
          </div>
          <div class="lbl">Rating</div>
        </div>
        <div class="stat">
          <div class="num">${a.sessions}</div>
          <div class="lbl">Sessions</div>
        </div>
        <div class="stat">
          <div class="num">${a.rate}</div>
          <div class="lbl">Per hour</div>
        </div>
      </div>
    </div>
    <div class="section-label">About</div>
    <p class="bio">${a.bio}</p>
    <div class="section-label">Expertise</div>
    <div class="tags" style="margin-bottom:14px">${(a.tags||[]).map(t=>`<div class="tag">${t}</div>`).join("")}</div>
    <div class="section-label">Reviews</div>
    ${(a.reviews||[]).map(r=>`
      <div class="review">
        <div class="rhead">
          <span class="rname">${r.name}</span>
          <div class="stars">${starsSVG(r.stars)}</div>
        </div>
        <p>${r.text}</p>
      </div>
    `).join("")}
  `;

  showScreen("advisor");
}

document.getElementById("book-btn").addEventListener("click", () => {
  if (!currentAdvisor) return;
  openBooking(currentAdvisor);
});

// ============================================================
// BOOKING
// ============================================================
const TIME_SLOTS = ["9:00 AM","10:00 AM","11:00 AM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function openBooking(advisor) {
  bookingState = { advisorId: advisor.id, date: null, time: null };
  document.getElementById("booking-title").textContent = `Book · ${advisor.name}`;
  document.getElementById("booking-form").style.display = "";
  document.getElementById("booking-confirm").style.display = "none";

  // Summary
  document.getElementById("sum-advisor").textContent = advisor.name;
  document.getElementById("sum-date").textContent    = "—";
  document.getElementById("sum-time").textContent    = "—";
  document.getElementById("sum-rate").textContent    = advisor.rate + "/hr";

  // Generate next 7 days
  const dateRow = document.getElementById("date-row");
  const today   = new Date();
  dateRow.innerHTML = Array.from({length:7}, (_,i) => {
    const d   = new Date(today);
    d.setDate(today.getDate() + i + 1);
    const day = DAYS_SHORT[d.getDay()];
    const num = d.getDate();
    const iso = d.toISOString().split("T")[0];
    return `<div class="date-pill" data-date="${iso}" data-label="${day} ${num}">
              <div class="d">${day}</div>
              <div class="n">${num}</div>
            </div>`;
  }).join("");

  dateRow.querySelectorAll(".date-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      dateRow.querySelectorAll(".date-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      bookingState.date = pill.dataset.date;
      document.getElementById("sum-date").textContent = pill.dataset.label;
    });
  });

  // Time slots
  const slotGrid = document.getElementById("slot-grid");
  slotGrid.innerHTML = TIME_SLOTS.map(t =>
    `<div class="slot" data-time="${t}">${t}</div>`
  ).join("");

  slotGrid.querySelectorAll(".slot").forEach(slot => {
    slot.addEventListener("click", () => {
      slotGrid.querySelectorAll(".slot").forEach(s => s.classList.remove("active"));
      slot.classList.add("active");
      bookingState.time = slot.dataset.time;
      document.getElementById("sum-time").textContent = slot.dataset.time;
    });
  });

  showScreen("booking");
}

// ============================================================
// CONFIRM BOOKING → Firebase
// ============================================================
document.getElementById("confirm-booking").addEventListener("click", async () => {
  const { advisorId, date, time } = bookingState;

  if (!date) { alert("Please select a date."); return; }
  if (!time) { alert("Please select a time slot."); return; }

  const advisor = allAdvisors.find(a => a.id === advisorId);
  if (!advisor) return;

  const booking = {
    advisorId,
    advisorName: advisor.name,
    advisorRole: advisor.role,
    date,
    time,
    rate:        advisor.rate,
    userId:      "jordan-lee",
    status:      "confirmed",
    createdAt:   serverTimestamp(),
  };

  try {
    const bookingsRef = ref(db, "bookings");
    const newRef      = push(bookingsRef);
    await set(newRef, booking);

    console.log("✅ Booking saved to Firebase:", { key: newRef.key, ...booking });

    // Show confirm screen
    document.getElementById("booking-form").style.display    = "none";
    document.getElementById("booking-confirm").style.display = "";
  } catch (err) {
    console.error("❌ Error saving booking:", err);
    alert("Booking failed. Check console.");
  }
});

document.getElementById("booking-done").addEventListener("click", () => {
  screenStack = [];
  showScreen("marketplace");
});

// ============================================================
// CHAT LIST
// ============================================================
function renderChatList() {
  const list = document.getElementById("chat-list");
  if (!allConversations.length) {
    list.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg><h3>No messages yet</h3><p>Book a session to start chatting with an advisor.</p></div>`;
    return;
  }

  list.innerHTML = allConversations.map(c => `
    <div class="chat-item" data-id="${c.id}">
      <div class="avatar" style="background:${c.color}">${c.initials}</div>
      <div class="who">
        <div class="name">
          ${c.name}
          ${c.online ? '<span class="online-dot"></span>' : ""}
        </div>
        <div class="last">${(c.messages && c.messages.length ? c.messages[c.messages.length-1].text : "No messages yet")}</div>
      </div>
      <div class="meta-r">
        <div class="time">${c.time}</div>
        ${c.unread ? `<div class="unread-badge">${c.unread}</div>` : ""}
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".chat-item").forEach(item => {
    item.addEventListener("click", () => openConversation(item.dataset.id));
  });
}

// ============================================================
// CHAT CONVERSATION
// ============================================================
function openConversation(id) {
  const conv = allConversations.find(c => c.id === id);
  if (!conv) return;
  currentConvId = id;
  conv.unread = 0;

  document.getElementById("conv-avatar").textContent           = conv.initials;
  document.getElementById("conv-avatar").style.background      = conv.color;
  document.getElementById("conv-name").textContent             = conv.name;
  document.getElementById("conv-status").textContent           = conv.online ? "online" : conv.cat;

  renderMessages(conv);
  showScreen("chat-conversation");
  renderChatList(); // refresh unread badges
}

function renderMessages(conv) {
  const win = document.getElementById("chat-window");
  const msgs = conv.messages || [];
  win.innerHTML = msgs.map(m => `
    <div class="bubble ${m.from}">
      ${m.text}
      <span class="t">${m.time}</span>

    </div>
  `).join("");
  win.scrollTop = win.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("chat-input");
  const text  = input.value.trim();
  if (!text || !currentConvId) return;

  const conv = allConversations.find(c => c.id === currentConvId);
  if (!conv) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
  const msg = { from:"me", text, time: timeStr };

  if (!conv.messages) conv.messages = [];
  conv.messages.push(msg);
  conv.time = timeStr;

  // Save message to Firebase
  const msgRef = push(ref(db, `conversations/${currentConvId}/messages`));
  set(msgRef, msg)
    .then(() => console.log("✅ Message saved to Firebase:", msg))
    .catch(err => console.error("❌ Error saving message:", err));

  input.value = "";
  renderMessages(conv);
  renderChatList();
}

document.getElementById("chat-send").addEventListener("click", sendMessage);
document.getElementById("chat-input").addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

// ============================================================
// Firebase realtime listeners
// ============================================================
function listenPosts() {
  onValue(ref(db, "posts"), snap => {
    allPosts = [];
    snap.forEach(child => {
      allPosts.unshift({ ...child.val(), id: child.key });
    });
    console.log("🔥 Posts updated:", allPosts.length, "posts");
    renderFeed();
  });
}

function listenAdvisors() {
  onValue(ref(db, "advisors"), snap => {
    allAdvisors = [];
    snap.forEach(child => {
      allAdvisors.push({ ...child.val(), id: child.key });
    });
    console.log("🔥 Advisors updated:", allAdvisors.length, "advisors");
    renderAdvisors();
  });
}

function listenConversations() {
  onValue(ref(db, "conversations"), snap => {
    allConversations = [];
    snap.forEach(child => {
      const data = child.val();
      // Convert Firebase object of messages to array
      if (data.messages && !Array.isArray(data.messages)) {
        data.messages = Object.values(data.messages);
      }
      allConversations.push({ ...data, id: child.key });
    });
    console.log("🔥 Conversations updated:", allConversations.length);
    renderChatList();
    // Refresh active conversation if open
    if (currentConvId) {
      const conv = allConversations.find(c => c.id === currentConvId);
      if (conv) renderMessages(conv);
    }
  });
}

function listenBookings() {
  onValue(ref(db, "bookings"), snap => {
    const bookings = [];
    snap.forEach(child => {
      bookings.push({ key: child.key, ...child.val() });
    });
    console.log("🔥 Bookings in Firebase:", bookings.length, "bookings");
    bookings.forEach(b => {
      console.log(`  → [${b.key}] ${b.advisorName} on ${b.date} at ${b.time} (${b.rate})`);
    });
    // Update profile booking count
    const countEl = document.getElementById("profile-booking-count");
    if (countEl) countEl.textContent = bookings.length;
  });
}

// ============================================================
// Boot
// ============================================================
(async () => {
  await seedIfEmpty();
  listenPosts();
  listenAdvisors();
  listenConversations();
  listenBookings();
})();
