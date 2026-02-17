import React from 'react';
import { motion } from 'framer-motion';
import QiblaTab from '../components/QiblaTab';

const QiblaView: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <QiblaTab />
        </motion.div>
    );
};

export default QiblaView;
