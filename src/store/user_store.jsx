import { createContext, useContext, useReducer } from "react";

const UserContext = createContext();

const initialState = {
  users: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_USERS":
      return {
        ...state,
        users: action.payload.users,
      };
    case "CREATE_USER":
      return {
        ...state,
        users: [...state.users, action.payload.user],
      };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload.email
            ? { ...user, ...action.payload.updatedUser }
            : user
        ),
      };
    case "DELETE_USER":
      console.log("called");
      return {
        ...state,
        users: state.users.filter((user) => user.email !== action.payload.id),
      };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, userDispatch: dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
