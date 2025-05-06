import React from 'react';
import * as motion from "motion/react-client"

interface AnimatedButtonProps {
    onClick?: () => void;
    children: React.ReactNode;

}
const AnimatedButton: React.FC<AnimatedButtonProps> = ({ onClick, children }) => {
    return (
        <motion.button
            whileHover={{
                scale: 1.3,
                // backgroundColor: "#someColor",
                // color: "#anotherColor"
            }}
            whileTap={{
                scale: 0.95,
            }}

            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 17,
            }}
            onClick={onClick}
            style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#1a73e8',
                color: 'white',
                outline: 'none',
                width: 'fit-content',
                height: '40px'
            }}
        >
            {children}
        </motion.button>
    );
};




export default AnimatedButton;

