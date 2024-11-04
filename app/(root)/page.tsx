'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchAPI } from "@/lib/fetch";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<{id: number, name: string}[]>([]);
  const [user, setUser] = useState<{method: string, id?: number, name?: string}>();
  const [message, setMessage] = useState<string | null>(null);
  console.log("users state : ", users)

  const getUsers = async () => {

    try {
      const datas = await fetchAPI(`/api/users`)
      setUsers(datas.users)
    }
    catch(error) {
      console.log(`error update : ${error}`)
    }

  }

  const createUser = async () => {

    try {
      const createdUser = await fetchAPI(`/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: user!.name
        })
      })
      console.log("createdUser : ", createdUser.user)
      getUsers()
    }
    catch(error) {
      console.log(`error update : ${error}`)
    }

  }

  const updateUser = async () => {

    try {
      if(users.length === 0 || !users) {
        setUser({...user, method: "update"});
        setMessage("Show list to retrieve data before deleting.");
        return
      }

      const updatedUser = await fetchAPI(`/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: user!.id, 
          name: user!.name
        })
      })
      console.log("updatedUser : ", updatedUser)
      getUsers()
    }
    catch(error) {
      console.log(`error update : ${error}`)
    }
  }

  const deleteUser = async () => {

    try {
      if(users.length === 0 || !users) {
        setUser({...user, method: "delete"});
        setMessage("Show list to retrieve data before deleting.");
        return
      }

      if((user && user!.id && user!.id === 0) || !user) {
        setUser({...user, method: "delete"});
        setMessage("The id cannot be less than 1.");
        return
      }
      const deletedUser = await fetchAPI(`/api/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: user!.id
        })
      })
      console.log("deletedUser : ", deletedUser)
      getUsers()
    }
    catch(error) {
      console.log(`error update : ${error}`)
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold uppercase text-center">CRUD Next.js & Prisma</h1>
        <div className="flex flex-row flex-wrap">
          <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] mb-5">
            <li className="mt-5">
              {(user && user.method === "get") && (<p className="text-red-500 drop-shadow-lg">{message}</p>)}
              <Button type="button" onClick={() => {
                getUsers()
                if(users.length === 0) {
                  setUser({...user, method: "get"})
                  setMessage("There is no user at the moment. Add one with \"Create user\".")
                }
              }}>Get all users</Button>
            </li>
            <li className="mt-5">Create User
              {(user && user.method === "create") && (<p className="text-red-500 drop-shadow-lg">{message}</p>)}
              <div className="flex flex-col justify-center items-center gap-2 mt-2">
                <div className="flex flex-row gap-1 items-center">
                  <Label htmlFor="nameCreate">Name</Label>
                  <Input 
                    id="nameCreate"
                    type="text"
                    value={(user && user.method === "create") ? user.name : ""}
                    onChange={(e) => setUser({...user, method: "create", name: e.target.value})}
                  />
                </div>
                <Button type="button" onClick={() => createUser()}>Create user</Button>
              </div>
            </li>

            <li className="mt-5">Update User
              <div className="flex flex-col justify-center items-center gap-2 mt-2">
                {(user && user.method === "update") && (<p className="text-red-500 drop-shadow-lg">{message}</p>)}
                <div className="flex flex-row gap-1 items-center">
                  <Label htmlFor="idUpdate">Id</Label>
                  <Input 
                    id="idUpdate"
                    type="number"
                    value={(user && user.method === "update") ? user.id : 0}
                    onChange={(e) => {
                      if(users.length === 0) {
                        setUser({ ...user, method: "update" })
                        setMessage("Show list to retrieve data before deleting.")
                        return
                      }

                      const filteredUser = users.filter(user => user.id === parseInt(e.target.value));

                      if(e.target) {
                        if(e.target.value === "0") {
                          setMessage("The id cannot be less than 1.")
                          return
                        }

                        if(filteredUser.length === 0) {
                          setMessage("No user matches this id.")
                          setUser({
                            ...user, 
                            method: "update", 
                            id: parseInt(e.target.value),
                            name: ""
                          })
                          return
                        } 

                        setUser({
                          ...user, 
                          method: "update", 
                          id: parseInt(e.target.value),
                          name: users.filter(thisUser => thisUser.id === parseInt(e.target.value))[0].name
                        })
                        setMessage(null);
                      }
                    }}
                  />
                </div>

                <div className="flex flex-row gap-1 items-center">
                  <Label htmlFor="nameUpdate">Name</Label>
                  <Input 
                    id="nameUpdate"
                    type="text"
                    value={(user && user.method === "update") ? user.name : ((user && user.method === "update" && user!.id) ? users.filter(thisUser => thisUser.id === user!.id )[0].name : "")}
                    onChange={(e) => {
                      if(users.length === 0) {
                        setUser({ ...user, method: "update" })
                        setMessage("Show list to retrieve data before deleting.")
                        return
                      }
          
                      if(users.length > 0 || (user && (!user!.id || user!.id === 0))) {
                        setUser({...user, method: "update", name: ""})
                        setMessage("The name cannot be linked to an id that is non-existent or less than 1")
                        return
                      }

                      setUser({...user, method: "update", name: e.target.value})}
                    }
                  />
                </div>
              
                <Button type="button" onClick={() => updateUser()}>Update user</Button>
              </div>
            </li>

            <li className="mt-5">Delete User
              <div className="flex flex-col justify-center items-center gap-2 mt-2">
                {user && user.method === "delete" && (<p className="text-red-500 drop-shadow-lg">{message}</p>)}
                <div className="flex flex-row gap-1 items-center">
                  <Label htmlFor="idDelete">Id</Label>
                  <Input 
                    id="idDelete"
                    type="number"
                    value={(user && user.method === "delete") ? user.id : 0}
                    onChange={(e) => {
                      {
                        if(users.length === 0) {
                          setUser({...user, method: "delete"});
                          setMessage("Show list to retrieve data before deleting.")
                          return
                        }

                        const filteredUser = users.filter(user => user.id === parseInt(e.target.value));
  
                        if(e.target) {
                          if(e.target.value === "0") {
                            setUser({...user, method: "delete", id: parseInt(e.target.value)})
                            setMessage("The id cannot be less than 1.")
                            return
                          }
  
                          if(filteredUser.length === 0) {
                            setMessage("No user matches this id.")
                            setUser({
                              ...user, 
                              method: "delete", 
                              id: parseInt(e.target.value),
                            })
                            return
                          } 
  
                          setUser({
                            ...user, 
                            method: "delete", 
                            id: parseInt(e.target.value),
                          })
                          setMessage(null);
                        }
                      }
                    }}
                  />
                </div>
              
                <Button type="button" onClick={() => deleteUser()}>Delete user</Button>
              </div>
            </li>
          </ol>
          <div className="list lg:border-l-2 ml-5 lg:pl-5">
            <h2 className="text-2xl font-bold underline">Users List</h2>
            {
              (users && Array.isArray(users) && users.length > 0) ? (
                <table className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] border-collapse">
                  <tr>
                    <th className="border p-2">Id</th>
                    <th className="border p-2">Name</th>
                  </tr>
                  {
                    users.map((user: {id: number, name: string}) => (
                      <tr key={user.id}>
                        <td className="border p-2">{user.id}</td>
                        <td className="border p-2">{user.name}</td>

                      </tr>
                    ))
                  }
                </table>
              ) : (
                <>
                  <p>List empty</p>
                  <p className="my-5">Click &quot;Get all users&quot; for display list</p>
                  <p>Or add user with "Create User" if there is no user already created</p>
                </>
              )
            }
          </div>
        </div>
      </main>
    </div>
  );
}
