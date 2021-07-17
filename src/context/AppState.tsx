import React, {useReducer} from "react";
import AppReducer, {ActionType} from "./AppReducer";
import AppContext from "./AppContext";
import {Types} from "./ContantTypes";
import { AsyncStorage } from "react-native";
import {ItemUser} from "../screens/users/ListUsers";
import {IGoogleUser} from "../screens/Login";
import axios from "axios";
//import {IGoogleUser} from "..";
// Es el conjunto de datos
interface ServerResponse {
    serverResponse:Array<ItemUser>
}
interface ServerResponseLogin {
    serverResponse: ItemUser | UserCreateError
}
interface UserCreateError {
    driver: Boolean,
    name: string,
    index: number,
    code: number,
}
const DataState = (props: any) => {
    const initialState = {
        searchbarVisible: false,
        uriphoto: "",
        itemuser: {},
        isLoadAvatar: false,
        listusers: [],
        serverErrorMessages: "",
        userAuth: {}
    }
    const [state, dispatch] = useReducer(AppReducer, initialState);
    const changeSearchBarVisible = (value: Boolean) => {
        dispatch({type: Types.SEARCHBARVISIBLE, payload: value});
    }
    const changeUri = (value: string, isInThePhone: Boolean) => {
        dispatch({type: Types.PHOTOLOADAVATAR, payload: isInThePhone});
        dispatch({type: Types.CHANGEURI, payload: value});
    }
    const loginGoogle = async (user: IGoogleUser, callBack: Function) => {
       var dataresult: any = await axios.post<ServerResponseLogin>("http://192.168.100.41:8000/api/users", {username: user.name, email: user.email, password: user.ide});
       var result: any = dataresult.data;
       if (result.serverResponse.code != null) {
        //Login user 
        var loginr: any = await axios.post("http://192.168.100.41:8000/api/login", {username: user.name, email: user.email, password: user.ide});
        if (loginr.data.serverResponse == "Credenciales incorrectas") {
            dispatch({type: Types.SETSERVERERRORMSN, payload: loginr.data.serverResponse});
            callBack(false);
        } else {
            dispatch({type: Types.SETAUTHUSER, payload: loginr.data.serverResponse});
            callBack(true);
        }
       }
       if (result.serverResponse._id != null) {
        //http://localhost:8000/api/users/60df667affede700328cdc48
        await axios.put("http://192.168.100.41:8000/api/users/" + result.serverResponse._id, {uriavatar: user.photo});
        var loginr: any = await axios.post("http://192.168.100.41:8000/api/login", {email: user.email, password: user});
        if (loginr.data.serverResponse == "Credenciales incorrectas") {
            dispatch({type: Types.SETSERVERERRORMSN, payload: loginr.data.serverResponse});
            callBack(false);
        } else {
            dispatch({type: Types.SETAUTHUSER, payload: loginr.data.serverResponse});
            callBack(true);
        }
       }
    }
    const loadMainListUsers = async() => {
        var token = state.userAuth.token;
        var result: Array<ItemUser> = await axios.get<ServerResponse>("http://192.168.100.41:8000/api/users", {
            headers: {
                "Authorization": token
            }
        }).then((item) => {
          return item.data.serverResponse
        });
        result.map((item) => {
            if(item.uriavatar != null && item.uriavatar.match(/\/api\/getportrait\/\w+/g) != null) {
                item.uriavatar = "http://192.168.100.41:8000" + item.uriavatar
            }
        });
        dispatch({type: Types.LOADUSERS, payload: result});
    }
    const setListusers = (list: Array<any>) => {
        dispatch({type: Types.LOADUSERS, payload: list});
    }
    
    return (
        <AppContext.Provider value={{
        searchbarVisible: state.searchbarVisible, 
        changeSearchBarVisible, 
        uriphoto: state.uriphoto, 
        changeUri,
        isLoadAvatar: state.isLoadAvatar,
        dispatch,
        loadMainListUsers,
        setListusers,
        loginGoogle,
        userAuth: state.userAuth,
        serverErrorMessages: state.serverErrorMessages,
        listusers: state.listusers,
        itemuser: state.itemuser}}>
            {props.children}
        </AppContext.Provider>
    )
}
export default DataState;