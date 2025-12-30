firebase.initializeApp({
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET"
});

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

function login(){
  auth.signInWithEmailAndPassword(email.value, password.value);
}

function logout(){
  auth.signOut();
}

auth.onAuthStateChanged(user=>{
  if(!user) return;
  login.hidden = true;
  app.hidden = false;

  db.collection("users").doc(user.uid).get().then(doc=>{
    window.userRole = doc.data().role;
    roleView.innerHTML = `<option>${window.userRole}</option>`;
    loadCalls();
  });
});

function addCall(){
  const file = photo.files[0];
  const ref = storage.ref('photos/'+Date.now()+file.name);
  ref.put(file).then(snap=>snap.ref.getDownloadURL()).then(url=>{
    db.collection("calls").add({
      customer: customer.value,
      status: status.value,
      photo: url,
      created: new Date(),
      roleAccess: window.userRole
    });
  });
}

function loadCalls(){
  db.collection("calls").onSnapshot(snap=>{
    calls.innerHTML = "";
    snap.forEach(doc=>{
      const c = doc.data();
      if(c.roleAccess === window.userRole || window.userRole === "Admin"){
        calls.innerHTML += `<li>${c.customer} - ${c.status}<br><img src='${c.photo}' width='80'></li>`;
      }
    });
  });
}

// Push notifications + Google Calendar hooks handled via Firebase Cloud Functions
