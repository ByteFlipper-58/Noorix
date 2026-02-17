import React from 'react';
import { motion } from 'framer-motion';
import TasbihTab from '../components/TasbihTab';

const TasbihView: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <TasbihTab />
        </motion.div>
    );
};

export default TasbihView;
