import React, { useState, useEffect } from 'react';
import { List, PersonCircle } from 'react-bootstrap-icons';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';
import Modal from '../../shared/modal/Modal';
import UserInitials from '../../shared/userInitals/UserInitials';

const Header: React.FC = () => {
    const [userName, setUserName] = useState<{ userName: string, firstName: string, lastName: string } | undefined>();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    const { keycloak } = useKeycloak();
    const navigate = useNavigate();

    const handleLogout = () => {
        setModalOpen(true);
    };

    useEffect(() => {
        if (keycloak?.tokenParsed) {
            const { preferred_username, given_name, family_name } = keycloak.tokenParsed;

            setUserName({
                userName: preferred_username || '',
                firstName: given_name || '',
                lastName: family_name || ''
            });
        }
    }, [keycloak]);

    const confirmLogout = () => {
        keycloak.logout()
            .then(() => {
                navigate('/login');
            })
            .catch((error) => {
                console.error("Logout failed", error);
            });
        setModalOpen(false);
    };

    const cancelLogout = () => {
        setModalOpen(false);
    };

    let [prevScrollpos, setPrevScrollpos] = useState(window.pageYOffset);
    useEffect(() => {
        window.onscroll = function () {
            var currentScrollPos = window.pageYOffset;
            if (prevScrollpos > currentScrollPos) {
                document.getElementById("hide-header")!.style.top = "0";
            } else {
                document.getElementById("hide-header")!.style.top = "-80px";
            }
            setPrevScrollpos(currentScrollPos);
        }
    }, [prevScrollpos]);

    return (
        <div id='hide-header' className='app-header hide-header'>
            <div className={`dropdown-container ${isOpen ? 'visible' : ''}`}>
                <a className='border' href='/dashboard'>Dashboard</a>
                <a className='border' href='/availability'>Verfügbarkeit</a>
                <a className='border' onClick={handleLogout}>Abmelden</a>
            </div>

            <div className='app-header'>
                <div className='start'>
                    <img src={process.env.PUBLIC_URL + '/stroodle-logo-white.png'} alt='Logo' className='stroodle-logo' />
                </div>

                <div className='end'>
                    <div className='button-container'>
                        <div className='nav-bar'>
                            <a className='border-hover' href='/dashboard'>Dashboard</a>
                            <a className='border-hover' href='/availability'>Verfügbarkeit</a>
                            <a className='border-hover' onClick={handleLogout}>Abmelden</a>
                        </div>
                        {userName && (
                            <>
                                <UserInitials
                                    firstName={userName.firstName}
                                    lastName={userName.lastName}
                                    size={40}
                                    backgroundColor='var(--text-color)'
                                    textColor='var(--base-color-1)'
                                />
                                <span className='user-name'>{userName.userName}</span>
                            </>
                        )}
                        <div className='nav-drop-down'>
                            <button className='list-button' onClick={toggleDropdown}>
                                <List className='icon list-icon' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                title="Abmelden"
                content={<p>Möchten Sie sich wirklich abmelden?</p>}
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
                confirmButtonText="Abmelden"
                cancelButtonText="Abbrechen"
                showCloseButton={false}
            />
        </div>
    );
};

export default Header;
