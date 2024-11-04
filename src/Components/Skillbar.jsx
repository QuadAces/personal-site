import { motion } from 'framer-motion';

export default function Skillbar({ percentage, text, image }) {
    return (
        <div className="flex flex-row justify-end mb-2">
            <div className="flex flex-row">
                {text && <label className="mr-2">{text}</label>}
                {image}
            </div>
            <div className="bg-blue-500 rounded-md h-6 ml-2 w-56 overflow-hidden">
                <motion.div
                    className="bg-orange-500 h-full rounded"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }} 
                    transition={{ duration: 1 }}
                ></motion.div>
            </div>
        </div>
    );
}
