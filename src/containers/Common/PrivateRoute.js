import React from "react";
import { View } from "react-native-animatable";
import NavigationUtil from "../../utils/NavigationUtil";

function PrivateRoute({component}) {

  return <View />;
}

export default PrivateRoute;

// import React from "react";
// import NavigationUtil from "../../utils/NavigationUtil";

// export default class PrivateRoute extends React.Component {

//   constructor(props){
//     super(props);
//   }

//   componentWillMount(){
//     // NavigationUtil.goToLogin()
//   }
//   render() {
//     return (
//       <props.component />
//     )
//   }
// }

