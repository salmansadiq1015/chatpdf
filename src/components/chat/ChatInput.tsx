import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef } from "react";
import { ChatContext } from "./ChatContext";

interface ChatInputProps {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);
  console.log(message.length);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                rows={1}
                ref={textareaRef}
                maxRows={4}
                autoFocus
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    addMessage();

                    textareaRef.current?.focus();
                  }
                }}
                placeholder="Enter your question..."
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              />

              <Button
                disabled={isLoading || message.length === 0 || isDisabled}
                className="absolute bottom-1.5 right-[8px]"
                aria-label="send message"
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus();
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

// ----------------------------------->

// import { Send, Mic } from "lucide-react";
// import { Button } from "../ui/button";
// import { Textarea } from "../ui/textarea";
// import { useContext, useRef, useState } from "react";
// import { ChatContext } from "./ChatContext";

// /// <reference lib="webworker" />

// interface ChatInputProps {
//   isDisabled?: boolean;
// }

// const ChatInput = ({ isDisabled }: ChatInputProps) => {
//   const { addMessage, handleInputChange, isLoading, message } =
//     useContext(ChatContext);

//   console.log(handleInputChange);

//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const recognitionRef = useRef<any | null>(null);
//   const [isListening, setIsListening] = useState(false);

//   const startSpeechRecognition = () => {
//     const recognition = new (window as any).webkitSpeechRecognition();

//     recognition.continuous = true;
//     recognition.interimResults = false;

//     recognition.onstart = () => {
//       setIsListening(true);
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//     };

//     recognition.onresult = (event: any) => {
//       const transcript = event.results[0][0].transcript;
//       handleInputChange(transcript);
//     };

//     recognitionRef.current = recognition;
//     recognition.start();
//   };

//   const stopSpeechRecognition = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//     }
//   };

//   return (
//     <div className="absolute bottom-0 left-0 w-full">
//       <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
//         <div className="relative flex h-full flex-1 items-stretch md:flex-col">
//           <div className="relative flex flex-col w-full flex-grow p-4">
//             <div className="relative">
//               <Textarea
//                 rows={1}
//                 ref={textareaRef}
//                 maxRows={4}
//                 autoFocus
//                 onChange={handleInputChange}
//                 value={message}
//                 placeholder="Enter your question..."
//                 className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
//               />

//               <Button
//                 disabled={isLoading || isDisabled}
//                 className="absolute bottom-1.5 right-8"
//                 aria-label="send message"
//                 onClick={() => {
//                   addMessage();
//                   textareaRef.current?.focus();
//                 }}
//               >
//                 <Send className="h-4 w-4" />
//               </Button>

//               <Button
//                 disabled={isLoading || isDisabled}
//                 className="absolute bottom-1.5 right-[-28px]"
//                 aria-label="start/stop voice recognition"
//                 onClick={() => {
//                   if (isListening) {
//                     stopSpeechRecognition();
//                   } else {
//                     startSpeechRecognition();
//                   }
//                 }}
//               >
//                 {isListening ? (
//                   <Mic className="h-4 w-4 text-red-500" />
//                 ) : (
//                   <Mic className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInput;
