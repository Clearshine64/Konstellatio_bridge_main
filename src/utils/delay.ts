export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// export async function getUserLocation(): Promise<GeolocationState> {
//     return new Promise(async (resolve) => {
//         const geolocationResult = await getNavigatorGeolocation();
//
//         geolocationResult.onchange = async function() {
//             const status = await geolocationStatus(geolocationResult.state);
//             if (status === GeolocationPermissionStatus.Granted) {
//                 await getLocation();
//             } else {
//                 resolve({
//                     permissionStatus: status,
//                     permissionGranted: false,
//                     geolocationEnabled: true,
//                 });
//             }
//         };
//
//         const successCallback = (pos: GeolocationPosition) => {
//             const crd = pos.coords;
//             resolve({
//                 geoCoords: crd,
//                 permissionStatus: GeolocationPermissionStatus.Granted,
//                 permissionGranted: true,
//                 geolocationEnabled: true,
//             });
//         };
//
//         const errorCallback = (err: GeolocationPositionError) => {
//             resolve({
//                 permissionStatus: GeolocationPermissionStatus.Granted,
//                 permissionGranted: true,
//                 geolocationEnabled: true,
//                 err: err,
//             });
//         };
//
//         const options = {
//             enableHighAccuracy: true,
//             timeout: 10000,
//             maximumAge: 0,
//         };
//
//         const getLocation = async () => {
//             if (navigator.geolocation) {
//                 const status = await geolocationStatus(geolocationResult.state);
//
//                 if (status === GeolocationPermissionStatus.Granted) {
//                     navigator.geolocation.getCurrentPosition(successCallback);
//                 } else if (status === GeolocationPermissionStatus.Prompt) {
//                     navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
//                 } else if (status === GeolocationPermissionStatus.Denied) {
//                     resolve({
//                         permissionGranted: false,
//                         permissionStatus: status,
//                         geolocationEnabled: true,
//                     });
//                 }
//             } else {
//                 resolve({
//                     permissionStatus: GeolocationPermissionStatus.Unknown,
//                     permissionGranted: false,
//                     geolocationEnabled: false,
//                 });
//             }
//         };
//
//         await getLocation();
//     });
// }

export function repeatable() {
    return new Promise((resolve) => {
        return 2
    });
    // const self = this;
    // this.loading = true;
    // let counter = 50;
    // this.interval = setInterval(async () => {
    //     const { error } = await self.getTx();
    //     if (!error) {
    //         const data = await self.getTx();
    //         if (!data.events || !data.logs) {
    //             self.invalid = true;
    //             self.tx = data;
    //         } else {
    //             const {
    //                 logs: [
    //                     {
    //                         success,
    //                         log,
    //                     },
    //                 ],
    //                 ...tx
    //             } = await self.getTx();
    //
    //             self.tx = {
    //                 ...tx,
    //                 log,
    //                 success,
    //             };
    //         }
    //         self.loading = false;
    //         self.err = false;
    //
    //         clearInterval(self.interval);
    //     }
    //     counter--;
    //
    //     if (counter === 0) {
    //         self.loading = false;
    //         clearInterval(self.interval);
    //     }
    // }, 1000);
}
