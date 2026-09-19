import { createContext, useEffect, useState } from "react";

export type IGeneralContext = {
  fullname: string;
  age: number;
  updateDetails: (name: string, age: number) => void;
} | null;

export const UserContext = createContext<string>("");
export const UpdateUserContext = createContext<any>(null);
export const generalDetailsContext = createContext<IGeneralContext>(null);

export function BasicContextProvider({ children }: any) {
  const [user, setUser] = useState("Jesse Hall");

  const changeFunction = (name: string) => {
    setUser(name);
  };

  const [generalInfo, setgeneralInfo] = useState<IGeneralContext>(null);
  const [fullName, setFullName] = useState("Emma");
  const [age, setAge] = useState(2);

  const setGeneralContextinfo = () => {
    setgeneralInfo({
      fullname: fullName,
      age: age,
      updateDetails: (myName, myAge) => {
        setFullName(myName);
        setAge(myAge);
      },
    });
  };

  useEffect(() => {
    setGeneralContextinfo();
  }, [fullName, age]);

  return (
    <generalDetailsContext.Provider value={generalInfo}>
      <UserContext.Provider value={user}>
        <UpdateUserContext.Provider value={changeFunction}>
          {children}
        </UpdateUserContext.Provider>
      </UserContext.Provider>
    </generalDetailsContext.Provider>
  );
}
