import Header from "./Header"
import { Panel } from "./Panel"
import { FaCamera, FaPaperclip, FaSearch, FaVideo } from "react-icons/fa"
import socket from "../../utils/SocketIO/SocketIOClient"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useFetchAllMessagesMutation } from "../../utils/redux/slices/userApiSlices"
import { useErrorHandler } from "../../pages/User/ErrorBoundary"
import { useFetchEnrolledCoursesTutors } from "../../Helpers/StudentChat"
import { getTimeFromDateTime } from "../../Helpers/data"
import Picker, { EmojiClickData } from 'emoji-picker-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMicrophone } from "@fortawesome/free-solid-svg-icons"
import { handlefileUpload } from "../../Helpers/Cloudinary"



export const Chat = () => {

    const [message, setMessage] = useState('')
    const [sender, setSender] = useState<any>()
    const [messages, setMessages] = useState<any>({})
    const handleError = useErrorHandler()
    const data: any = useFetchEnrolledCoursesTutors(handleError)
    const [Instructors, setInstructors] = useState<any>(data || [])
    const [selectedInstructor, setSelectedInstructor] = useState<any>()
    const [fetchAllMessages] = useFetchAllMessagesMutation()
    const [typingStatus, setTypingStatus] = useState<any>({})
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [showMediaOptions, setShowMediaOptions] = useState<boolean>(false);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([])
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
    const [onlineUsers, setOnlineUsers] = useState<any>({});

    useEffect(() => {
        if (data && data.length > 0) {
            setInstructors(data);
            setSelectedInstructor(data[0]);
        }
    }, [data])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const Instructor = selectedInstructor?._id
                if (Instructor) {
                    const getAllMessages = await fetchAllMessages(Instructor).unwrap()
                    // const sortedMessages = [...getAllMessages.Messages].sort((a: any, b: any) => parseTime(a.Time) - parseTime(b.Time));
                    setMessages(getAllMessages)
                }
            } catch (error: any) {
                if (error.data.message === 'No messages found') {
                    setMessages({})
                }
                handleError(error.data.message)
            }
        }
        fetchData()
    }, [data, selectedInstructor]);

    useEffect(() => {
        const token = Cookies.get('StudentAccessToken')
        socket.emit('authenticate', token)
        socket.on('Authorized', (user) => {
        
            setSender(user)
            data?.forEach((instructor: any) => {
                const room = `private-${user._id}-${instructor._id}`
                socket.emit('joinRoom', room)
            })
        })

        socket.on('userOnline', (data) => {
            console.log(data, 'online')
            setOnlineUsers((prev: any) => ({ ...prev, [data.userId]: 'online' }));
        })

        socket.on('userOffline', (data) => {
            setOnlineUsers((prev: any) => ({ ...prev, [data.userId]: 'offline' }));
        })

        socket.on('Unauthorized', (error: string) => {
            handleError(error)
        })

        socket.on('privateMessage', (message: any) => {
            setMessages((prevMessages: any) => {
                const newMessage = {
                    text: message.message,
                    CurrentUser: message?.senderId === sender?._id,
                    Time: getTimeFromDateTime(message.Time),
                    TimeforSorting: new Date(message.Time),
                    type: message.type
                }
                const updatedMessages = [...prevMessages['Messages'] || [], newMessage]
                // updatedMessages.sort((a: any, b: any) => a.TimeforSorting - b.TimeforSorting)
                // updatedMessages.forEach((item) => delete item.TimeforSorting)
                return {
                    ...prevMessages,
                    ['Messages']: updatedMessages
                }
            })
        })

        socket.on('typing', (data: { userId: string }) => {
            console.log(typingTimeout)
            setTypingStatus((prevStatus: any) => ({
                ...prevStatus,
                [data.userId]: true,
            }));
        });

        socket.on('stopTyping', (data: { userId: string }) => {
            setTypingStatus((prevStatus: any) => ({
                ...prevStatus,
                [data.userId]: false,
            }));
        })

        return () => {
            socket.off('Authorized')
            socket.off('Unauthorized')
            socket.off('privateMessage')
        }

    }, [data, Instructors, useFetchEnrolledCoursesTutors, setMessages,socket])

    const sendMessage = (recipient: any) => {
        if (message === '') {
            return
        }
        const room = `private-${sender._id}-${recipient._id}`
        const text = message
        const type = 'text'
        socket.emit('privateMessage', { type, sender, recipient, text, room })
        setMessage('')
    }
    const onEmojiClick = (emojiObject: EmojiClickData) => {
        setMessage(message + emojiObject.emoji);
    };

    const handleTyping = (e: any) => {
        setMessage(e.target.value)
        const room = `private-${sender._id}-${selectedInstructor?._id}`
        socket.emit('typing', { userId: selectedInstructor?._id, room: room })
        setTypingTimeout(
            setTimeout(() => {
                socket.emit("stopTyping", {
                    userId: selectedInstructor?._id,
                    room: room,
                });
            }, 2000)
        );
    }
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement> | Blob, type: string) => {
        let file: File | Blob | undefined;
        if (event instanceof Blob) {
            file = event;
        } else {
            file = event.target.files?.[0];
        }
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append('upload_preset', 'vedaByte');
                const upload = await handlefileUpload(formData);
                const text = upload.url;
                const recipient = selectedInstructor
                const room = `private-${sender?._id}-${selectedInstructor?._id}`;
                socket.emit('privateMessage', { type, sender, recipient, text, room });
            } catch (error) {
                console.log(error)
            } finally {
            }

        }
    };

    useEffect(() => {
        if (!isRecording && audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
            handleFileUpload(audioBlob, "audio");
            setAudioChunks([]);
        }
    }, [isRecording, audioChunks]);

    const startRecording = () => {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                const recorder = new MediaRecorder(stream)
                recorder.ondataavailable = (event)=>{
                    if (event.data.size > 0) {
                        setAudioChunks((prev) => [...prev, event.data])
                    }
                };
                recorder.start();
                setMediaRecorder(recorder);
                setAudioStream(stream);
                setIsRecording(true);
            })
            .catch((error) => {
                console.error("Error accessing microphone:", error);
            });
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
            if (audioStream) {
                audioStream.getTracks().forEach((track) => track.stop());
                setAudioStream(null);
            }
        }
    };
    return (
        <>
            <Header />
            <div className="overflow-hidden fixed w-screen shadow-lg ">
                <Panel />
                <div className='main mt-4 mb-5'>
                    <div className="flex flex-col overflow-y-auto lg:flex-row bg-gray-200 shadow-xl rounded-lg border-2 border-gray-300 h-screen sm:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl" style={{ height: '85%' }}>
                        <div className="flex flex-col border-r-2 lg:w-1/4 sm:max-w-screen-md lg:max-w-full">
                            <div className="relative w-full lg:w-full p-3 border-b-2 bg-buttonGreen ">
                                <input
                                    type="text"
                                    className="w-full h-10 pl-10 pr-4 rounded-md mt-3 shadow focus:outline-none"
                                    placeholder="Search"
                                />
                                <div className="absolute inset-y-0 left-2 top-3 flex items-center pl-3 text-black pointer-events-none ">
                                    <FaSearch />
                                </div>
                            </div>
                            {data.length ? (
                                data.map((instructor: any) => (
                                    <div key={instructor._id} className="flex w-full h-16 border-2 border-gray-300 justify-start items-start p-3" onClick={() => setSelectedInstructor(instructor)}>
                                        <div className="relative">
                                            <img src={instructor.profileImage} className="w-12 h-12 rounded-full bg-black" alt={instructor.name} />
                                            {onlineUsers[instructor?._id] === 'online' && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-700 rounded-full border-2 border-white"></span>
                                            )}
                                        </div>
                                        <span className="ml-4 text-xs font-semibold">{instructor.name}</span>
                                        {typingStatus[sender?._id] && (
                                            <span className="text-sm text-black ml-2 mt-2">
                                                Typing...
                                            </span>
                                        )}

                                    </div>
                                ))
                            ) : (
                                <p className=" flex justify-center text-zinc-700 font-semibold">No messages found !</p>
                            )}
                        </div>
                        {selectedInstructor ? (
                            <div className="flex flex-col justify-between border-2 border-gray-200  w-full ">
                                <div className="flex justify-start items-center border-2 border-sky-100 shadow-md  h-16 p-3 gap-5">
                                    <img src={selectedInstructor?.profileImage} className="w-10 h-10 rounded-full bg-black" alt="" />

                                    <p>{selectedInstructor?.name}</p>
                                    {onlineUsers[selectedInstructor?._id] === 'online' && (
                                        <span className="top-10 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                    )}
                                </div>
                                <div className=" flex flex-col-reverse w-full h-full bg-zinc-900  overflow-y-auto">

                                    {Object.keys(messages).length > 0 ? (
                                        Object.keys(messages).map((userId, index) => (
                                            <div key={index} className="">
                                                {messages[userId].map((msg: any, idx: number) => (
                                                    <div key={idx} className={`flex p-1 mb-2 ${msg.CurrentUser ? 'justify-end' : 'justify-start'} items-center gap-1`}>
                                                        {msg.CurrentUser === false ? (
                                                            <img src={selectedInstructor?.profileImage} className="w-5 h-5  rounded-full bg-black border-2 border-zinc-400" alt="" />
                                                        ) : (
                                                            ''
                                                        )}
                                                        <div className={`inline-block px-2 py-1 rounded-lg shadow-md bg-lime-200 relative flex-col`}>
                                                            {msg?.type === "text" && <span>{msg?.text}</span>}
                                                            {msg?.type === "image" && (
                                                                <img
                                                                    src={msg?.text}
                                                                    alt="Sent image"
                                                                    className="w-40 h-40 object-cover rounded"
                                                                />
                                                            )}
                                                            {msg?.type === "video" && (
                                                                <video controls className="w-40 h-40 rounded">
                                                                    <source src={msg?.text} type="video/mp4" />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            )}
                                                            {msg?.type === "audio" && (
                                                                <audio controls className="w-40">
                                                                    <source src={msg?.text} type="audio/mpeg" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            )}

                                                            <span className="text-xs text-gray-500 self-end ml-2">
                                                                {msg.Time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="justify-center items-center  flex text-white">
                                            <h1>No messages</h1>
                                        </div>
                                    )}
                                  
                                </div>
                                <div className=" flex justify-between  items-center  h-14 border-2 border-sky-200 ">

                                    <button
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="p-2 bg-sky-100 border-2 border-sky-200 transition-transform duration-300 hover:scale-110"
                                    >
                                        😊
                                    </button>
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-52 z-10 bg-white shadow-lg rounded">
                                            <button
                                                onClick={() => setShowEmojiPicker(false)}
                                                className="text-red-500 p-1"
                                            >
                                                ✕
                                            </button>
                                            <Picker onEmojiClick={onEmojiClick} />
                                        </div>
                                    )}
                                    {showMediaOptions && (
                                        <div className="absolute flex justify-between items-center gap-5 bottom-52 z-10 bg-white shadow-lg rounded p-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, "image")}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className=" flex text-center p-1   cursor-pointer transition-transform duration-300 hover:scale-110"
                                            >
                                                <FaCamera />
                                            </label>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                onChange={(e) => handleFileUpload(e, "audio")}
                                                className="hidden"
                                                id="audio-upload"
                                            />
                                            <button
                                                onClick={isRecording ? stopRecording : startRecording}
                                                className="flex text-center p-1   cursor-pointer transition-transform duration-300 hover:scale-110"
                                            >
                                                <span className="text-sm font-semibold flex items-center">
                                                    {isRecording && <span className="text-red-500 mr-1">🔴</span>}
                                                    <FontAwesomeIcon icon={faMicrophone} />
                                                </span>
                                            </button>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => handleFileUpload(e, "video")}
                                                className="hidden"
                                                id="video-upload"
                                            />
                                            <label
                                                htmlFor="video-upload"
                                                className="flex text-center  p-1 cursor-pointer transition-transform duration-300 hover:scale-110"
                                            >
                                                <FaVideo />
                                            </label>
                                            <button
                                                onClick={() => setShowMediaOptions(false)}
                                                className="block w-full text-sm font-semibold p-2 text-zinc-600 mt-2  border-red-300 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => setShowMediaOptions(!showMediaOptions)}
                                        className="p-3 bg-sky-100 border-2 border-sky-200 text-gray-500 transition-transform duration-300 hover:scale-110"
                                    >
                                        <FaPaperclip />
                                    </button>
                                    <input onChange={handleTyping}
                                        value={message}
                                        type="text"
                                        className="w-full h-full p-2    rounded-md  shadow focus:outline-none"
                                        placeholder="Enter the message......"
                                    />
                                    <button className=" flex justify-center items-center  font-semibold  bg-green-900 text-center w-24 h-full text-white" onClick={() => sendMessage(selectedInstructor)}>Send</button>


                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center ml-96 text-emerald-900 font-semibold text-xl items-center">
                                <p>No message to show</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

