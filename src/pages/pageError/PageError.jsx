import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/UI/button/botton";
import { Link } from "react-router-dom";

export default function NotFound() {
  const [hover, setHover] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900">
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-6xl font-bold"
      >
        404
      </motion.h1>
      <p className="text-xl mt-4">Oops! La página que buscas no existe.</p>
      <motion.div
        className="text-6xl mt-4 cursor-pointer"
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
      >
        {hover ? "😵" : "😕"}
      </motion.div>
      <Link to="/">
        <Button className="mt-6 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-xl">
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
}
