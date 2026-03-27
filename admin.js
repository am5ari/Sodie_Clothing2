import { db, storage } from "./firebase.js"

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"

import {
ref,
uploadBytes,
getDownloadURL,
deleteObject
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js"


const uploadBtn = document.getElementById("uploadBtn")
const productList = document.getElementById("productList")


/* ---------------- UPLOAD PRODUCT ---------------- */

uploadBtn.onclick = async () => {

const name = document.getElementById("name").value
const price = document.getElementById("price").value
const size = document.getElementById("size").value
const stock = document.getElementById("stock").value
const category = document.getElementById("category").value

const imageFile = document.getElementById("image").files[0]

if(!imageFile){

alert("Upload an image")
return

}


const storageRef = ref(storage,"products/"+imageFile.name)

await uploadBytes(storageRef,imageFile)

const imageURL = await getDownloadURL(storageRef)


await addDoc(collection(db,"products"),{

name:name,
price:Number(price),
size:size,
stock:Number(stock),
category:category,
image:imageURL

})


alert("Product Uploaded!")

loadProducts()

}


/* ---------------- LOAD PRODUCTS ---------------- */

async function loadProducts(){

productList.innerHTML=""

const snapshot = await getDocs(collection(db,"products"))

snapshot.forEach((docItem)=>{

const item = docItem.data()

const card = document.createElement("div")

card.className="product-admin"

card.innerHTML=`

<img src="${item.image}">

<h3>${item.name}</h3>

<p>$${item.price}</p>

<p>Stock: ${item.stock}</p>

<button>Delete</button>

`

card.querySelector("button").onclick = async ()=>{

const confirmDelete = confirm("Delete this product?")

if(!confirmDelete) return


/* delete firestore document */

await deleteDoc(doc(db,"products",docItem.id))


/* delete image from storage */

const imageRef = ref(storage,item.image)

deleteObject(imageRef).catch(()=>{})


loadProducts()

}

productList.appendChild(card)

})

}


/* ---------------- INITIAL LOAD ---------------- */

loadProducts()