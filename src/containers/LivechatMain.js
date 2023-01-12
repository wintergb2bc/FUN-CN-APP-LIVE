import React from 'react';
import { StyleSheet, Text, Image, View, Platform, Keyboard, Dimensions, TouchableOpacity, Linking, WebView ,Animated} from 'react-native';
import { connect } from 'react-redux';
import { Flex, Toast, Modal, ActivityIndicator, WingBlank, Button } from 'antd-mobile-rn';
import { Actions } from 'react-native-router-flux';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Touch from 'react-native-touch-once';
import WebViewAndroid from 'react-native-webview-android' 
import WebViewIOS from 'react-native-webview';
import * as Animatable from 'react-native-animatable'
const AnimatableView = Animatable.View

const {
    width, height
} = Dimensions.get('window')

let fireLoad = false
const WEBVIEW_REF = 'webview';
const patchPostMessageFunction = function() {
	var originalPostMessage = window.postMessage;
  
	var patchedPostMessage = function(message, targetOrigin, transfer) { 
	  originalPostMessage(message, targetOrigin, transfer);
	};
  
	patchedPostMessage.toString = function() { 
	  return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
	};
  
	window.postMessage = patchedPostMessage;
       setTimeout(()=>{   //防止亂彈瀏覽器
		var a = document.getElementsByTagName('a');
		
		for(var i = 0; i < a.length; i++){ 
		a[i].onclick = function (event) {
			window.postMessage(this.href);
			event.preventDefault();
		}
		}
			  },5000) 
  };
  const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

class LivechatMain extends React.Component {

    constructor(props) {
		super(props); 
		this._onNavigationStateChange = this._onNavigationStateChange.bind(this)
		this._onMessage = this._onMessage.bind(this)
		  //console.log(this.props)  
				this.state = {
					LiveChatKey:0,
					loadD:false, 
					initialHeight:height - 80,
					heightXJ: height - 80,
					keyboardOpen:0,
					loadD:false,
					loadone:1, 
					gameKey:0,
                    UrlNes:LiveChatX, 
                    HeadHeight:50,
                    LiveChatXT:'',
                    LiveChatOpen:false
				}
			 
	  }

    componentWillMount(props) {
 
             //  监听键盘打开事件
             if(Platform.OS === "android" ){
                 this.keyboardDidShowListener = Keyboard.addListener(
                     "keyboardDidShow",
                     this._keyboardDidShow.bind(this)
                   );
                   //  监听键盘关闭事件
                   this.keyboardDidHideListener = Keyboard.addListener(
                     "keyboardDidHide",
                     this._keyboardDidHide.bind(this)
                   );
     
             }
       }
       componentWillUnmount() {
         if(Platform.OS === "android" ){
             this.keyboardDidShowListener.remove();
             this.keyboardDidHideListener.remove();
         }
       }
 
   
    
         //拿客服链接
  getLiveChatX(){
    fetchRequest(ApiPort.LiveChat, "GET") 
      .then(data => {
          console.log(data,'111')   
          //LiveChatX = data.url;
            this.setState({
                LiveChatXT: data.result,
                LiveChatKey:Math.random(), 
            })
      })
      .catch(() => {});
  }

   
    
     _keyboardDidShow(e) {
		this.setState({
		  heightXJ: this.state.initialHeight - e.endCoordinates.height
		});
	  }
	
	  _keyboardDidHide(e) {
		// console.log(e.endCoordinates.height);
		this.setState({ heightXJ: this.state.initialHeight });
	  }	  
     
      
    _onNavigationStateChange(e) { 
        const{LiveChatXT}=this.state;
		if(fireLoad == false){
				return;
		}
		if(LiveChatXT == ""){  
			return;
		}

		if (e.url.split("?")[0]!= LiveChatXT.split("?")[0]) {
		  this.refs[WEBVIEW_REF].stopLoading();
		  setTimeout(()=>{
			 Linking.openURL(e.url);
			 this.getLiveChatX();
		  },1000)
		  
	
		  return false
		} 
		return true
	  }


      _onMessage = (e) => {
		console.log(e.nativeEvent.data)  
        //alert('2222')
        if(e.nativeEvent.data){
            Linking.openURL(e.nativeEvent.data).catch(err => console.error('An error occurred', err))
  
        }
    }

    closeButton(type){ 
        if(window.openOrien == 'orientation') {
            //游戏页面开启客服，关闭客服需要解锁竖屏
            window.removeOrientation && window.removeOrientation()
        }
        if(type == 2){
            
            LivechatDragType = true; 
        }

        if(type == 1){
            LivechatDragType = false; 
            this.getLiveChatX();//重新獲取客服url
        }

        if(window.GetGameListReload){
            GetGameListReload();
        }
        if(window.ReloadMoneyHome){
            ReloadMoneyHome() //首頁
        }
        if(window.reloadPage){
            reloadPage()  //存款
        }
        if(window.LiveChatIconGlobe){
            LiveChatIconGlobe(); // 球
        } 
        if(window.SponsorshipNewReload){
            SponsorshipNewReload(); //贊助
        }
        if(window.ReloadLivechatDragType){
            ReloadLivechatDragType();  //開啟懸浮
        }
 
        
        this.setState({
            LiveChatOpen:false
        })
    }
    
 

 
    render() {
        const {HeadHeight,LiveChatOpen, heightXJ,LiveChatKey,LiveChatXT, widthS,heightS} = this.state
         
        window.LiveChatOpenGlobe = () => {
            //开启竖屏锁定
            window.openOrientation && window.openOrientation()
            this.setState({
                LiveChatOpen:true, 
            })
            if(window.maintenanceLiveChatXT != '') {
                //维护客服
                this.setState({
                    LiveChatXT: window.maintenanceLiveChatXT
                })
                return
            }
            
            if(LiveChatXT == ''){
                this.getLiveChatX()
            }
        }

        window.closeButtonfoAndroid = ()=>{
            this.closeButton();
        }

        window.ReloadgetLiveChatX = () =>{
            //this.getLiveChatX() 
            LivechatDragType = false// 客服懸浮球 
            this.setState({
                LiveChatOpen:false,
                LiveChatXT:'', 
            })
        }

        console.log(LiveChatXT,'LiveChatXT')
      return (
 
 

        <View style={LiveChatOpen == true ? styles.openReady : styles.cantopen}>
              
              <AnimatableView  
                    easing="ease-out-cubic"
                    animation={LiveChatOpen ? "fadeInUp" : "fadeOutRight"}
                    duration={800}
                >
      
           
            {LiveChatOpen == true  && 
                 <Flex style={{top:Platform.OS === "android" ?10:25,backgroundColor:"#fff",width:widthS, height:Platform.OS === "android" ? 15:45,zIndex:130}}>
                          
                          <Flex.Item style={{alignItems:'flex-start',justifyContent:'flex-start',paddingLeft:15,paddingTop:(Platform.OS === "android" ? 9:13),}}>
                               <TouchableOpacity hitSlop={{top: 12, bottom: 30, left: 25, right: 25}}  onPress={()=>  this.closeButton(1)}  >
                               <Image resizeMode='stretch' source={require('../images/icon-back.png')} style={{ width: 24, height: 24, }} /> 
                             
                               </TouchableOpacity>
                           </Flex.Item>


                           <Flex.Item style={{alignItems:'center',justifyContent:'center',top:Platform.OS === "android" ?7:5}}>
                                 <TouchableOpacity  hitSlop={{top: 12, bottom: 30, left: 25, right: 25}}    onPress={()=>this.getLiveChatX()} >
                                    <View style={{alignItems:'center',justifyContent:'center',    flexDirection: "row",}}>
                                    <Text style={{color:'#000',fontSize:14,fontWeight:'bold'}}>在线客服</Text>
                                    <Image
                                            resizeMode="stretch"
                                            source={require("../images/csreload.png")}
                                            style={{ width: 16, height: 16 ,left:5}}
                                            />
                                     </View>
                                   </TouchableOpacity>
                           </Flex.Item>

                    
                         <Flex.Item style={{alignItems:'flex-end' ,top:6,right:15}} >
                               <TouchableOpacity  hitSlop={{top: 12, bottom: 30, left: 25, right: 25}}    onPress={()=>this.closeButton(2)} >
                                <Image
                                    resizeMode="stretch"
                                    source={require("../images/icon-css-mall.png")}
                                    style={{ width: 22, height: 22 }}
                                    />
                               </TouchableOpacity>
                           </Flex.Item> 

                           {/* <View style={{alignItems:'flex-end',position:'absolute',top:HeadHeight == 60 ?-30 :(Platform.OS === "android" ? 12:15),right:15}} >
                               <TouchableOpacity  hitSlop={{top: 10, bottom: 10, left: 5, right: 5}}    onPress={()=>this.openmenuX()} >
                               <Image  resizeMode='stretch' source={require('../images/menu_burger.png')} style={{ width: 25, height: 25}} /> 
                               </TouchableOpacity>
                           </View>  */}
               </Flex>
                  }

                   
               <View style={LiveChatOpen == true ? styles.CanXOpen: styles.CloseGame}>
        
                         {Platform.OS === "android"  ? 
							
							<WebViewAndroid
							  key={LiveChatKey} 
							  ref={WEBVIEW_REF}   
                			  source={{uri:LiveChatXT}}
							  javaScriptEnabled={true}
                              domStorageEnabled={true}
						      scalesPageToFit={false}  
							  onNavigationStateChange={this._onNavigationStateChange}
                              style={{width:width,height:heightXJ,marginTop:0,}}
							  thirdPartyCookiesEnabled={true}
							 /> 
						
							:Platform.OS === "ios" &&
                                <WebViewIOS
                                key={LiveChatKey}
                                ref={WEBVIEW_REF}
                                onMessage={this._onMessage}  
                                injectedJavaScript={patchPostMessageJsCode}
                                source={{uri:LiveChatXT}}  
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                scrollEnabled={false}
                                scalesPageToFit={Platform.OS === 'ios'? true : false} 
                                style={{width:width,height:height-50,marginTop:0,}}
                                thirdPartyCookiesEnabled={true}
                            /> 
							} 
                               
                </View>                    

                </AnimatableView>
            </View>

          

        )
    }
}

 

export default connect()(LivechatMain);


const styles = StyleSheet.create({
    preferentialTag: {
		top:600,
		width,
		height: height,
		justifyContent: 'center',
		backgroundColor: '#000', 
		shadowColor: '#666',
		shadowOpacity: .2,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: -6 },
		elevation: 4
	},
    openReady:{
        height:height,backgroundColor: '#fff'
    },
    cantopen:{
        zIndex:0,
        height:0,
    },
    CloseGame:{ 
       zIndex:0, 
    },
    CanXOpen:{
       zIndex:99,
       height:height-85,
       width:width,
       top:30
    },
    NoOpen:{
        zIndex:0,
    },
    canOpen:{   
        backgroundColor: '#1a1a1a'
    },
    closeButton:{
		top:Platform.OS === 'ios' ?15:15,
		left:20,
		fontSize:24,fontWeight:'900',color:'#0e7e00',
		width:40,
		height:40,
		borderWidth: 1,
		borderRadius:20,
		paddingTop:Platform.OS === 'ios' ?8:5,
		borderColor: '#0e7e00',
		textAlign:'center'
	 },
     navHeader: {
        backgroundColor: '#171717',
        paddingLeft:8,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        borderBottomWidth: 1,
        borderColor: '#404040'
  },
   
    menu:{
        left:0,  
        height:height,
        backgroundColor: '#171717',
        position: 'absolute',
        zIndex:999

    },
    container: {
        flex: 1,
        padding: 0
            
      },
    
      button: {
            height:30,
      },
        
        buttonB:{
            paddingTop:15,
            paddingBottom:15,
            borderBottomWidth: 1,
            backgroundColor: '#171717',
            borderColor: '#404040'
        },
        widthSome:{
            width:width - (13+42+5+45+11+18+10),
        },
        fontText:{
            textAlign: 'center',
            color:"#fff",
        fontSize: 16,
        },
        
        fontText2:{
            textAlign: 'left',
            paddingLeft:13,
            color:"#fff",
            fontSize: 14,
        },
        fontText3:{
            textAlign: 'center',
            color:"#fff",
            fontSize: 14,
        },
        
        MoneyBg:{
            opacity:0,
            backgroundColor: '#000',
            position: 'absolute', 
        },
        MenuXbox:{
        
            borderBottomWidth: 1,
            borderColor: '#404040',
            backgroundColor: '#013626',
            
        },
        MenuXd:{
            flex:0.9,
        paddingTop:10,
        paddingBottom:10,
        },
        MenuXdIcon:{
            flex:0.1,
        
        },
        MenuXc:{
        
            borderBottomWidth: 1,
            borderColor: '#013626'
            
        },
        MenuXb:{   //下拉選單樣式
            paddingTop:10,
            paddingBottom:10,
            paddingLeft:15,
            borderColor: '#485d57',
            borderBottomWidth: 1,
            backgroundColor: '#001f16'
            
        },
        
        iconMenu:{
            width:10,
            height:10,
            borderRadius:80,
            marginTop:4,
            backgroundColor: '#f6e4a6'
        },
        navHeader: {
            backgroundColor: '#171717',
            paddingLeft:8,
            paddingRight:15,
            paddingTop:5,
            paddingBottom:5,
            borderBottomWidth: 1,
            borderColor: '#404040'
      },
    
      navMenu: {
        backgroundColor:'#404040',
        },
        
        
        dowButton: {
            backgroundColor: '#00633c',
        
            borderBottomWidth: 1,
            borderColor: '#00633c'
        },
        
        dowButton2: {
            backgroundColor: '#171717',
            paddingTop:15,
            paddingBottom:15,
            paddingLeft:5,
            paddingRight:15,
            borderBottomWidth: 1,
            borderColor: '#404040'
        },
        
        
        NoticeText:{
    
        },
        userMoney:{  //menu 菜單
            width:width-50,
            position: 'absolute', 
            top: Platform.OS === "android" ? 25 :35, 
            left: 19, 
            borderRadius:12,
            backgroundColor: '#001f16',  
        },


        userMoneyBox:{
             padding:7,
             borderBottomWidth: 1,
             borderColor: '#444444',
             
        }, 
      userMoneyText:{
          fontSize:13,
            color:"#fff"
        },
        
    
    
        userMoneybox1:{
            flex:0.4,
        },
        userMoneybox2:{
            flex:0.4,
            top:6,
        },
        userReload:{
            flex:0.1,
            top:1,
            borderLeftWidth: 1,
            borderColor: '#404040'
        },
        oneT:{ //一鍵轉帳
        flex:0.4,
        paddingTop:2,
        paddingLeft:4,
        paddingRight:4,
        paddingBottom:2,
        borderRadius:12,
        marginLeft:5,
        backgroundColor: '#00633c',
        },
        oneT2:{
        flex:0.4,
         paddingTop:2,
        paddingLeft:4,
        paddingRight:4,
        paddingBottom:2,
        borderRadius:12,
        marginLeft:5,
        }

});
