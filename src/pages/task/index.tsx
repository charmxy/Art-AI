import React, { type FC, useState, useEffect, useRef } from "react";
import { Radio, Button, List,Slider, message } from "antd";
import {
  uploadFile,
  taskPrompt,
  getTaskQueue,
  getTaskStatus,
  getTaskVideo
} from "@/api";
import type { CheckboxGroupProps } from "antd/es/checkbox";
import { CloseCircleOutlined } from "@ant-design/icons";
import ReactPlayer from 'react-player';
import "./index.css";

const Task: FC = () => {
  const token = localStorage.getItem("access_token") || "";
  const [messageApi, contextHolder] = message.useMessage();
  const [image, setImage] = useState(null);
  const [filename, setFilename] = useState(null);
  const [model, setModel] = useState<boolean>("");
  const [size, setSize] = React.useState<string>("");
  const [lora, setLora] = React.useState<string>("");
  const [list, setList] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [stepsCount, setStepsCount] = React.useState<number>(25);
  const options: CheckboxGroupProps<string>["options"] = [
    { label: "SVD", value: "svd" }
  ];
  const options2: CheckboxGroupProps<string>["options"] = [
    { label: "DetailerXL", value: "1720709685796684408" },
    { label: "Cinematic Lighting", value: "1720709685796684409" },
    { label: "Maybe Better Pose Lora XL", value: "1720709685796684410" },
    { label: "Hands XL", value: "1720709685796684411" }
  ];
  const options3: CheckboxGroupProps<string>["options"] = [
    { label: "3:5(768*1280)", value: "0" },
    { label: "1:1(1024*1024)", value: "1" },
    { label: "9:16(832*1472)", value: "2" },
    { label: "5:3(1280*768)", value: "3" }
  ];
   
  const fileInputRef = useRef(null); // 用于引用隐藏的 input 元素
  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setModel(value);
  };

  const onChange2 = ({ target: { value } }: RadioChangeEvent) => {
    setLora(value);
  };

  const onChange3 = ({ target: { value ,label} }: RadioChangeEvent) => {
console.log(label)
    setSize(value);
  };

  useEffect(() => {}, [token]);

  useEffect(() => {
    // if (files?.length > 0) {
    //   setFileList([...files]);
    // }
  }, []);

  const handleImageChange = async e => {
    const file = e.target.files[0]; // 获取上传的文件
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
    const widths = [768,1024,832,1280]
    const height = [1280,1024,1472,768]
    const res = await taskPrompt({
      image_name: filename,
      model_name: model,
      width: widths[size],
      height: height[size],
      lora: lora,
      steps: stepsCount
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
      // const dataURL = await new Promise((resolve, reject) => {
      //   const reader = new FileReader();
      //   reader.onloadend = () => resolve(reader.result);
      //   reader.onerror = reject;
      //   reader.readAsDataURL(videoBlob);
      // });
      // 设置视频的 URL
      // 创建一个 Object URL，供 video 标签使用
      const videoUrl = URL.createObjectURL(videoBlob);
      setVideoUrl(videoUrl);
      console.log(videoUrl)
      
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
            <List
              className="h-[50vh] overflow-y-auto"
              dataSource={list}
              renderItem={(item) => (
                <List.Item key={item.task_id}>
                  <div onClick={()=>{taskVideo(item)}} className="w-full flex flex-col gap-[10px] px-[8px] py-[10px] bg-[#dae1e8] rounded-lg transition-all duration-500 hover:bg-[#ff8c19] cursor-pointer">
                    <div>{`任务ID：${item.task_id}`}</div>
                    <div>{`用户：${item.client_id}`} {item.user_type == 0 ? (<span>普通用户</span>):(<span className="text-[#ff4d4f]">VIP用户</span>)}</div>
                    <div>{`模型：${new Function("return " + item.inputs)()?.model_name}`}</div>
                    <div>{`状态：${item.status == 2 ? "已完成" : "进行中"}`}</div>
                    <div>{`开始时间：${item.start_time}`}</div>
                    <div>{`结束时间：${item.end_time}`}</div>
                  </div>
                </List.Item>
              )}
            />
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
              // <video controls autoPlay width="750">
              //   <source src={videoUrl} type="video/mp4" />
              //   Your browser does not support the video tag.
              // </video>
              <ReactPlayer url={videoUrl} controls width='100%' height='400px' />
            )}
          </div>
        </div>
        <div className="w-full flex flex-col items-cemter gap-[40px] border-[#e5e7eb] border-2 border-solid py-[24px] px-[20px]">
          <div className="w-full flex-col items-start gap-[30px] ">
            <div className="text-[16px] font-[800] leading-[32px]">模型</div>
            <Radio.Group options={options} onChange={onChange} value={model} />
          </div>
          <div className="w-full flex-col items-start gap-[30px] ">
            <div className="text-[16px] font-[800] leading-[32px]">LoRA</div>
            <Radio.Group options={options2} onChange={onChange2} value={lora} />
          </div>
          {/* <div className="w-full flex-col items-start gap-[30px] ">
            <div className="text-[16px] font-[800] leading-[32px]">LoRA</div>
            <Radio.Group options={options} onChange={onChange} value={model} />
          </div> */}
          <div className="w-full flex-col items-start gap-[30px] ">
            <div className="text-[16px] font-[800] leading-[32px]">尺寸</div>
            <Radio.Group options={options3} onChange={onChange3} value={size} />
          </div>

          <div className="w-full flex-col items-start gap-[30px] ">
            <div className="text-[16px] font-[800] leading-[32px]">取样步骤</div>
            <Slider min={1} max={100} value={stepsCount} onChange={setStepsCount} />
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
