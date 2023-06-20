import config from "@/config";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { Mutex } from "async-mutex";

const baseUrl = `${config.API_URL}/api`
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl,
})


// const customFetchBase: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> 
//     = async (args, api, extraOptions) => {
//         await mutex.waitForUnlock();

//         let res = await baseQuery(args, api, extraOptions);
//         if(res.error?.status === 401) {
//             const release = await mutex.acquire();

//             try {
//                 const refRes = await baseQuery(
//                     {credentials:'include',url:}
//                 )
//             }
//         }
// }