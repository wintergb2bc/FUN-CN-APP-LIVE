import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, StyleSheet, TextInput, Clipboard, Platform, } from 'react-native';
import { Toast, Modal } from 'antd-mobile-rn';
import { connect } from "react-redux";
import actions from "@/lib/redux/actions/index";

const { width, height } = Dimensions.get('window')

class CsCallPopup extends React.Component {
  constructor() {
    super();
    this.state = {
      isTyping: false,
      content: '',
      isSuccess: false,
      enableSubmit: false,
      isSubmit: false,
    }
  }

  contentHandler(v) {
    const content = v.replace(/^\s+/g, '')
    this.setState({
      content: content,
      isTyping: true,
      enableSubmit: content.length > 0 && content.length <= 50 ? true : false
    })
  }

  submitHandler() {
    const { content, enableSubmit } = this.state
    if (!enableSubmit || !content.length) return

    const data = {
      comment: content
    }
    this.setState({ enableSubmit: false })
    fetchRequestSB(ApiPort.CallBack, "POST", data)
      .then(res => {

        if (res.isSuccess) {
          this.setState({
            isSuccess: res.isSuccess,
            // isSubmit: false
          })
        } else {
          Toast.fail(res.message)
        }
      })
      .catch(error => { });
  }

  closePopup(val) {
    this.props.showCsCallPopupHandler(val)
  }

  render() {
    const { content, isTyping, isSuccess, enableSubmit, isSubmit } = this.state

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={true}
        style={{
          padding: 0,
          width: width,
          borderRadius: 10,
          paddingTop: 0,
          backgroundColor: 'transparent'
        }}
      >
        <View style={{ marginBottom: Platform.OS == 'ios' ? height * .18 : 0, backgroundColor: "#fff", borderRadius: 10, overflow: 'hidden' }}>
          <View style={styles.container} >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', lineHeight: 48 }}>{isSuccess ? '提交成功' : '回拨服务'}</Text>

            <TouchableOpacity
              onPress={this.closePopup.bind(this, !this.props.csCall.showCsCallPopup)}
              style={{ position: 'absolute', top: 18, right: 15, width: 25, height: 25 }}
            >
              <Image
                resizeMode='stretch'
                source={require('@/images/icon/closeWhite2.png')}
                style={{ width: 12, height: 12, }}
              />
            </TouchableOpacity>
          </View>

          {
            !isSuccess ? (
              <>

                {
                  // isSubmit &&
                  // <View style={{ position: 'absolute', width: width * .95, top: 0, height: 300, zIndex: 99999, justifyContent: 'center', alignItems: 'center' }}>
                  //   <View style={{ width: 135, height: 75, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10 }}>
                  //     <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 75 }}>请稍候...</Text>
                  //   </View>
                  // </View>
                }

                <View style={{ padding: 15, justifyContent: "center", alignItems: 'center' }}>

                  <Text style={styles.textDescription}>
                    亲爱的VIP会员，请描述并提交所遇到的问题，
                  </Text>
                  <Text style={styles.textDescription}>
                    VIP客服将在 5 分钟内回拨至您绑定的手机号码
                  </Text>

                  <View style={[styles.textInputArea, { borderColor: ((!content.length && isTyping) || (content.length > 50)) ? '#EB2121' : '#E6E6EB', }]}>
                    <TextInput
                      value={content}
                      style={{ color: "#222222", width: width * .8, fontSize: 14, padding: 10, textAlignVertical: 'top' }}
                      placeholder={'最多50个字'}
                      placeholderTextColor={'#999999'}
                      // maxLength={50}
                      onChangeText={value => this.contentHandler(value)}
                      blurOnSubmit={true}
                      multiline={true}
                    />

                  </View>

                  {
                    ((!content.length && isTyping) || (content.length > 50)) ? (
                      <View style={{ backgroundColor: '#FEE5E5', borderRadius: 10, justifyContent: 'flex-start', width: width * .8, padding: 10 }}>
                        <Text style={styles.textHitError}>{!content.length && isTyping ? `问题反馈内容不得为空` : content.length >= 50 ? `问题反馈仅限50字符以内` : ''}</Text>
                      </View>
                    ) : null
                  }
                </View>


                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                  <TouchableOpacity
                    onPress={this.submitHandler.bind(this)}
                    style={{ backgroundColor: enableSubmit ? '#00A6FF' : '#EFEFF4', width: width * .8, height: 40, borderRadius: 8 }}
                  >
                    <Text style={[styles.submitBtnText, { color: enableSubmit ? '#fff' : '#BCBEC3', }]}>提交</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={{ padding: 15, justifyContent: "center", alignItems: 'center' }}>

                  <Image
                    resizeMode='stretch'
                    source={require('@/images/icon/checked.png')}
                    style={{ width: 50, height: 50, marginBottom: 15 }}
                  />

                  <Text style={{ fontSize: 14, lineHeight: 20, textAlign: 'center' }}>
                    乐天使已收到您的留言，VIP专属客服将会使用国家代码电话为 +852 的手机于 5 分钟内与您联系，记得留意您的手机哟。 谢谢
                  </Text>

                </View>


                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                  <TouchableOpacity
                    onPress={this.closePopup.bind(this, !this.props.csCall.showCsCallPopup)}
                    style={{ backgroundColor: content.length ? '#00A6FF' : '#EFEFF4', width: width * .8, height: 40, borderRadius: 8 }}
                  >
                    <Text style={[styles.submitBtnText, { color: '#fff', fontSize: 16 }]}>知道了</Text>
                  </TouchableOpacity>
                </View>
              </>
            )

          }
        </View>
      </Modal >
    );
  }
}

const mapStateToProps = state => {
  return {
    csCall: state.csCall
  };
}
const mapDispatchToProps = dispatch => {
  return {
    showCsCallPopupHandler: (val) => dispatch(actions.ACTION_ShowCsCallPopupHandler(val)),
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(CsCallPopup);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00A6FF',
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  textHitError: {
    color: '#EB2121',
    fontSize: 12,
    textAlign: 'left',
  },
  textDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666666'
  },
  textInputArea: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999999',
    marginVertical: 10,
    height: 73,
    overflow: 'hidden',
  },
  submitBtnText: {
    textAlign: 'center',
    lineHeight: 40,
    fontWeight: 'bold'
  },
})