import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';

function Contents() {

    const [showFirst, setShowFirst] = useState(false);
    const [showSecond, setShowSecond] = useState(false);
    const [showThird, setShowThird] = useState(false);
    const [showFourth, setShowFourth] = useState(false);
    const [showFifth, setShowFifth] = useState(false);
    const [showSixth, setShowSixth] = useState(false);

    useEffect(() => {
        // Delay before showing the first element
        const firstTimer = setTimeout(() => {
            setShowFirst(true);

            // Hide the first element after it has been visible for 3 seconds
            // const hideFirstTimer = setTimeout(() => {
            //     setShowFirst(false);
            // }, 3000); // Duration the first element is visible

            // return () => clearTimeout(hideFirstTimer);
        }, 300); // Initial delay before showing the first element

        // Delay before showing the second element
        const secondTimer = setTimeout(() => {
            setShowSecond(true);
        }, 1500); // Delay to show the second element after the first element

        const thirdTimer = setTimeout(() => {
            setShowThird(true);
        }, 3500); // Delay to show the second element after the first element

        const fourthTimer = setTimeout(() => {
            setShowFourth(true);
        }, 5500); // Delay to show the second element after the first element

        const fifthTimer = setTimeout(() => {
            setShowFifth(true);
        }, 7500); // Delay to show the second element after the first element

        const sixthTimer = setTimeout(() => {
            setShowSixth(true);
        }, 9500); // Delay to show the second element after the first element

        return () => {
            clearTimeout(firstTimer);
            clearTimeout(secondTimer);
            clearTimeout(thirdTimer);
            clearTimeout(fourthTimer);
            clearTimeout(fifthTimer);
            clearTimeout(sixthTimer);
        };
    }, []);

    return (
        <div className='flex flex-col justify-start items-center min-h-screen space-y-8'>
            <AnimatePresence>
                {showFirst && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}
                        key="first"
                    >
                        Welcome to TeamFinder
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showSecond && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        style={{ fontSize: '18px', fontWeight: 'bold' }}
                        key="second"
                        className='mt-8'
                    >
                        For people looking to join teams
                    </motion.div>
                )}
                {showThird && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        style={{ fontSize: '18px', fontWeight: 'bold' }}
                        key="third"
                    >
                        For teams looking to add members
                    </motion.div>
                )}

                {showFourth && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        style={{ fontSize: '18px', fontWeight: 'bold' }}
                        key="fourth"
                    >
                        Find events across multiple colleges
                    </motion.div>
                )}

                {showFifth && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        style={{ fontSize: '18px', fontWeight: 'bold' }}
                        key="fifth"
                    >
                        Meet new people, or reconnect with old acquaintances
                    </motion.div>
                )}

                {showSixth && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            key="sixth"
                        >
                            <p className='text-md font-bold'>Compete and win big!</p>
                            <p className='text-sm'>Don't let your friend group limit you.</p>
                            <Link to="/login">
                                <Button className='m-2'>Join Now</Button>
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Contents;
