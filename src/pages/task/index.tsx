import React, { type FC, useState, useEffect, useRef } from "react";
import { Radio, Button, message } from "antd";
import {
  uploadFile,
  taskPrompt,
  getTaskQueue,
  getTaskStatus,
  getTaskVideo
} from "@/api";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { CloseCircleOutlined } from "@ant-design/icons";

import "./index.css";

const Task: FC = () => {
  const token = localStorage.getItem("access_token") || "";
  const [messageApi, contextHolder] = message.useMessage();
  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState(null);
  const [model, setModel] = useState<boolean>("");
  const [list, setList] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const options: CheckboxGroupProps<string>["options"] = [
    { label: "SVD", value: "svd" }
  ];

  const fileInputRef = useRef(null); // 用于引用隐藏的 input 元素
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    console.log("radio3 checked", value);
    setModel(value);
  };

  useEffect(() => {}, [token]);

  useEffect(() => {
    // if (files?.length > 0) {
    //   setFileList([...files]);
    // }
  }, []);

  const handleImageChange = async e => {
    const file = e.target.files[0]; // 获取上传的文件
    console.log(file);
    setFilename(file.name);
    const formData = new FormData();
    formData.append("image", file);
    if (file) {
      const imageUrl = URL.createObjectURL(file); // 创建临时 URL 进行预览
      setImage(imageUrl);
    }
    const res = await uploadFile(formData);
    if (res) {
      message.success("上传成功");
    } else {
      message.error("上传失败");
    }
  };

  // const handleImageChange = e => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file); // 创建临时 URL 进行预览
  //     setImage(imageUrl);
  //   }
  // };

  const handleUploadClick = () => {
    fileInputRef.current.click(); // 触发隐藏的文件输入框
  };

  const performTask = async () => {
    const res = await taskPrompt({
      image_name: filename,
      model_name: model,
      width: 429
    });
    console.log(res);
  };

  const taskQueue = async () => {
    const res = await getTaskQueue();
    console.log(res);
  };

  const taskStatus = async () => {
    const res = await getTaskStatus();
    setList([...res.data.data]);
  };

  const taskVideo = async row => {
    try {
      const output = new Function("return " + row.outputs)();
      const response = await getTaskVideo({
        filename: output?.["10"]?.gifs[0]?.filename,
        type: "output"
      });
      // 将二进制数据转换为 Blob 对象
      const videoBlob = new Blob([response.data], { type: "video/mp4" });

      // 创建一个 Object URL，供 video 标签使用
      const videoUrl = URL.createObjectURL(videoBlob);

      // 设置视频的 URL
      setVideoUrl(videoUrl);
      console.log(videoUrl);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  useEffect(() => {
    // 记得清理 URL 对象
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl); // 释放 URL 对象
      }
    };
  }, [videoUrl]);

  return (
    <div className="w-full py-[120px]">
      <div
        className
        className="w-full grid grid-cols-5 gap-[20px] h-[75vh] px-[20px]"
      >
        <div className="w-full flex flex-col items-cemter gap-[40px] border-[#e5e7eb] border-2 border-solid py-[24px] px-[20px]">
          <div className="w-full flex-col items-start gap-[30px] ">
            <div className="text-[16px] font-[800] leading-[32px]">任务</div>
          </div>
          <Button
            color="purple"
            variant="solid"
            className="w-full"
            onClick={taskQueue}
          >
            查看队列
          </Button>
          <Button
            color="purple"
            variant="solid"
            className="w-full"
            onClick={taskStatus}
          >
            查看执行状态
          </Button>
          <div className="w-full flex-col items-start gap-[30px] ">
            <div className="text-[16px] font-[800] leading-[32px]">
              任务列表
            </div>
            {list.map((item, index) => (
              <div
                key={index}
                className="w-full py-4"
                onClick={() => {
                  taskVideo(item);
                }}
              >
                {item.task_id}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-[35px] px-[30px] col-span-3 border-[#e5e7eb] border-1 border-solid">
          {image ? (
            <div className="w-full relative bg-[#f5f5f5] rounded-lg p-[10px]">
              <img className="w-auto h-auto mx-auto" src={image} alt="upload" />
              <CloseCircleOutlined
                onClick={() => {
                  setImage("");
                }}
                className="absolute right-1 top-1"
              />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-[20px]">
              <img
                className="w-[128px] h-[128px]"
                src={"/image.svg"}
                alt="upload"
              />
              <Button onClick={handleUploadClick}>上传图片</Button>
              <input
                className="hidden"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
          )}

          <div className="w-[64px]">
            <img
              className="w-[64px] h-[64px]"
              src={"/arrow.svg"}
              alt="upload"
            />
          </div>
          <div className="w-full ">
            <span className="mx-auto text-[24px] font-[600] leading-[48px] text-[#a3a3a3] text-center">
              生成结果
            </span>
            {videoUrl && (
              <video controls width="750">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col items-cemter gap-[40px] border-[#e5e7eb] border-2 border-solid py-[24px] px-[20px]">
          <div className="w-full flex-col items-start gap-[30px] ">
            <div className="text-[16px] font-[800] leading-[32px]">模型</div>
            <Radio.Group options={options} onChange={onChange} value={model} />
          </div>
          <Button
            color="purple"
            variant="solid"
            className="w-full"
            disabled={!model || !image}
            onClick={performTask}
          >
            生成
          </Button>
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

export default Task;
