import React from "react";
import {View, Image, StyleSheet, ImageBackground} from "react-native";
import { TextInput, Button} from "react-native-paper";
interface Mystate {
  username: string,
  password: string,
  visible:boolean
}
class App extends React.Component<any, Mystate> {
  constructor(props: any){
    super(props);
    this.state ={
      username: "",
      password: "",
      visible: true
    }
  }
  loginGoogle() {

  }
  render() {
    return <ImageBackground style={styles.body} source={require("./android/assets/img/Background.png.png")}>
      <View style={styles.centerObjects}> 
       <Image style={styles.logo} source={require("./android/assets/img/logo.png.png")}/>
       </View> 
      <View style={styles.containerTextfield}>
        <TextInput
          label="Username"
          onChangeText={(text) =>{ 
            this.setState({
              username: text
            })
          }}
        /> 
        <TextInput style={styles.marginTop}
          label="Password"
          secureTextEntry={this.state.visible}
          right={<TextInput.Icon name="eye" onPress={() => {
            this.setState({
              visible: !this.state.visible
            })
          }}/>}
          onChangeText={(text) => { 
            this.setState({
              password: text
            })
          }}
        />   
        <Button  style={styles.marginTop} mode="contained">
          Login
        </Button>
        <Button icon="google" style={styles.marginTop}  mode="contained" onPress={() => { 
            this.loginGoogle(); 
        }}>
          Login with google
        </Button>
      </View> 
    </ImageBackground>
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  logo:{ 
  marginTop: "10",
  height: "60%",
  width: "60%"
  

},
containerTextfield: {
  padding: 10
},
centerObjects: {
  alignItems: "center"
},
/*marginTop: {
  marginTop: 10
},*/

});
export default App;