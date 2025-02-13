import React, { type FC, useEffect, useState } from "react";
import { Button, Modal, Form, Input, Dropdown } from "antd";
import type { FormProps } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useUserStore } from "@/store";
import { loign, register } from "@/api";
import type { MenuProps } from 'antd';
 type FieldType = {
  username?: string;
  password?: string;
};

const Navbar: FC = () => {
  const { setUserState, userState } = useUserStore();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionType, setActionType] = useState<string>("login");
  const onLogin = () => {
    setOpen(true);
    setLoading(true);

    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const onClose = () => {
    setOpen(false);
  };

  const loginOut = ()=>{
    setUserState({})
    localStorage.removeItem("access_token");
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <a onClick={loginOut}>
          退出登录
        </a>
      ),
      key: '0',
    }]
  const onFinish: FormProps<FieldType>["onFinish"] = async values => {
    const { username, password } = values;
   
    if (actionType === "login") {
      const data = await loign({
        username: username,
        auth_type: "password",
        credential: password
      });
      setUserState({ username: username, token: data.data.token });
      localStorage.setItem("access_token", data.data.token);
      onClose();
    } else {
      await register({ username: username, pwd: password });
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {}, [location]);

  return (
    <div className="w-full fixed top-0 left-0 z-10 py-[16px] px-[36px] bg-black">
      <div className="flex justify-between items-center">
        <div className="w-[945px] flex flex-row items-center gap-[40px]">
          <div className="flex justify-start items-center gap-[6px]">
            {/* <img
              className="w-[32px] h-[32px] cursor-pointer"
              src={"/images/header/logo.png"}
              alt="logo"
            /> */}
            <span
              className="text-[20px] font-[870] leading-[32px] tracking-[.04em] text-[#FFFFFF] cursor-pointer"
              onClick={() => {}}
            >
              {"Test-AI"}
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center gap-[16px]">
          <div className="flex justify-start items-center gap-[4px]">
            {userState?.username ? (
              <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()} >
                <span className="text-[18px] font-[500] leading-[32px] text-[#FFFFFF] cursor-pointer">
                  {userState?.username}
                </span>
              </a>
            </Dropdown>
            ) : (
              <Button size="large" onClick={onLogin}>
                登录
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        title={null}
        footer={null}
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <div className="w-full flex flex-col items-center gap-[32px] py-[20px] ">
          <div className="text-[20px] font-[870] leading-[32px] tracking-[.04em] text-[#000000]">
            {actionType === "login" ? "登录" : "注册"}
          </div>
          <Form
            name="basic"
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="w-full"
          >
            <Form.Item<FieldType>
              name="username"
              rules={[
                { required: true, message: "Please input your username!" }
              ]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your password!" }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit" className="w-full">
                {actionType === "login" ? "登录" : "注册"}
              </Button>
            </Form.Item>
            <div className="w-full text-right">
              <Button
                color="pink"
                variant="link"
                onClick={() => {
                  setActionType(actionType === "login" ? "register" : "login");
                }}
              >
                {actionType === "login" ? "注册" : "去登录"}
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
