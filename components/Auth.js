import { useState } from "react"
import { useRouter } from "next/router"
import Cookie from "universal-cookie"


const cookie = new Cookie()


export default function Auth() {

  const router = useRouter()
  const [ username, setUsername ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ isLogin, setIsLogin ] = useState(true)

  const login = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/auth/jwt/create/`,
        {
          method: "POST",
          body: JSON.stringify({ username: username, password: password}),
          headers: {
            "Content-Type": "application/json",
          }
        }
      ).then((res) => {
        if (res.status === 400) {
          throw "authentication failed"
        } else if (res.ok) {
          return res.json()
        }
      }).then((data) => {
        const options = { path: "/"}
        cookie.set("access_token", data.access, options)
      })
      router.push("/main-page")
    } catch(err) {
      alert(err)
    }
  }

const authUser = async (e) => {
  e.preventDefault()
  if (isLogin) {
    login()
  } else {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/register/`, {
        method: "POST",
        body: JSON.stringify({ username: username, password: password}),
        headers: {
          "Content-Type": "application/json",
        }
      }).then((res) => {
        if (res.status === 400) {
          throw "authentication failed"
        }
      })
      login()
    } catch(err) {
      alert(err)
    }
  }
}

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          { isLogin? "Login" : "Sign up" }
        </h2>
      </div>

      <form className="mt-8 space-y-6" onSubmit={authUser} >
        <input type="hidden" name="remember" value="true" />
        <div className="-space-y-px rounded-md shadow-sm">
          <div>
            <input 
              name="username" 
              type="text" autoComplete="username" 
              required className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
          </div>

          <div>
            <input 
              name="password" 
              type="password" 
              autoComplete="current-password" 
              required className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
              placeholder="Password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-sm">
            <span onClick={() => setIsLogin(!isLogin)} className="cursor-pointer font-medium text-white hover:text-indigo-500">
              change mode ?
            </span>
          </div>
        </div>

        <div>
          <button type="submit" className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" ariaHidden="true">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
            </span>
            { isLogin? "Login with JWT" : "Create new user" }
          </button>
        </div>

      </form>
    </div>
  )
}