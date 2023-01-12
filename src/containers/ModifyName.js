import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Toast } from "antd-mobile-rn";
import {
  nameTest,
} from "../actions/Reg";
import { Toasts } from "./Toast";

class ModifyName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      isName: true,
      editable: true,
    };
  }

  componentDidMount() {
    if (this.props.firstName !== "") {
      this.setState({
        editable: false,
      });
    }
  }

  Names(val) {
    let name = val;
    let isName = false;
    if (nameTest.test(name)) {
      isName = true;
    }

    this.setState(
      {
        name,
        isName,
      },
      () => {
        this.verify();
      }
    );
  }

  verify() {
    const st = this.state;
    let nameVerify = false;
    if (st.name && st.isName) {
      nameVerify = true;
    }
    this.setState({ nameVerify });
  }

  submit() {
    const { name, isName } = this.state;

    if (name === "") {
      Toasts.fail("请输入真实姓名");
      return;
    }
    if (!isName) {
      Toasts.fail("姓名格式错误");
      return;
    }

    const params = {
      firstName: name,
    };

    Toast.loading("加载中,请稍候...", 2000);
    fetchRequest(window.ApiPort.Member, "PUT", params)
      .then((res) => {
        Toast.hide();
        if (res.isSuccess) {
          Toasts.success("成功", 2);
          Actions.pop();
          this.props.getUser();
        } else {
          Toasts.fail("error");
        }
      })
      .catch((err) => {
        Toast.hide();
        console.log(err);
      });
  }

  render() {
    const { name, isName, nameVerify, editable } = this.state;
    return (
      <View
        style={{ flex: 1, backgroundColor: "#EFEFF4", paddingHorizontal: 15 }}
      >
        <View style={styles.boxWrap}>
          <Text style={{ color: "#666666", fontSize: 14 }}>真实姓名</Text>
          <TextInput
            value={name}
            maxLength={18}
            placeholder="请填写真实姓名"
            onChangeText={(val) => {
              this.Names(val);
            }}
            placeholderTextColor={"#999"}
            editable={editable}
            style={[
              styles.inputView,
              { borderColor: name != "" && !isName ? "#EB2121" : "#ccc" },
            ]}
          />
          {name != "" && !isName && (
            <View style={styles.errView}>
              <Text style={{ color: "#EB2121", fontSize: 12 }}>真实姓名格式错误</Text>
            </View>
          )}

          <Text style={{ color: "#999999", fontSize: 12, marginTop: 12 }}>
            姓名只允许修改一次{" "}
          </Text>
        </View>
        {nameVerify ? (
          <TouchableOpacity
            style={{
              height: 44,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#00A6FF",
              borderRadius: 8,
              marginTop: 24,
            }}
            onPress={() => this.submit()}
          >
            <Text style={{ color: "#fff", fontSize: 14 }}>提交</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              height: 44,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#E1E1E6",
              borderRadius: 8,
              marginTop: 24,
            }}
          >
            <Text style={{ color: "#BCBEC3", fontSize: 14 }}>提交</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default ModifyName;

const styles = StyleSheet.create({
  boxWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 16,
    marginTop: 15,
  },
  inputView: {
    borderRadius: 4,
    height: 44,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  errView: {
    backgroundColor: "#FEE0E0",
    borderRadius: 8,
    paddingLeft: 15,
    marginTop: 10,
    paddingVertical: 10,
  },
});
