function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

const publicVapidKey =
	"BDPfEh70bIlgjkpRJL3lX3bEVXDrmqlL-UeBJ8pu7cdnHoKkYTLvzyn51_oU1yCria3VY_bdfnIDuDuGlaSTyk4";

// Register service worker
if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("service-worker.js")
		.then(async (registration) => {
			console.log("Service Worker Registered!");

			console.log(registration);

			subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
			});

			console.log(subscription);

			sessionStorage.setItem("sw-subscription", JSON.stringify(subscription));
			return subscription;
		});
}

// Name of the Cache.
const CACHE = "aircheckerCache";

// Select files for caching.
let urlsToCache = ["index.html", "assets", "scripts"];

// Cache all the selected items once application is installed.
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE).then((cache) => {
			console.log("Caching started.");
			return cache.addAll(urlsToCache);
		})
	);
});

// Whenever a resource is requested, return if its cached else fetch the resourcefrom server.
self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response;
			}
			return fetch(event.request);
		})
	);
});

// Listen for push notification event
self.addEventListener("push", (event) => {
	const data = event.data.json();

	self.registration.showNotification(data.title, {
		body: data.body,
		icon: data.icon,
	});
});
