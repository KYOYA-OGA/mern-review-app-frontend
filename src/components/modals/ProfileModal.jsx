import React, { useState, useEffect } from 'react';
import { getActorProfile } from '../../api/actor';
import { useNotification } from '../../hooks';
import ModalContainer from './ModalContainer';

export default function ProfileModal({ visible, profileId, onClose }) {
  const [profile, setProfile] = useState({});

  const { updateNotification } = useNotification();

  const fetchActorProfile = async () => {
    const { error, actor } = await getActorProfile(profileId);
    if (error) updateNotification('error', error);

    setProfile(actor);
  };

  useEffect(() => {
    if (profileId) fetchActorProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const { avatar, name, about } = profile;

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <div className="w-72 p-5 rounded bg-white dark:bg-primary flex flex-col items-center text-center space-y-3">
        <img className="w-28 h-28 rounded-full" src={avatar} alt={name} />
        <h1 className="dark:text-white text-primary font-semibold lg:text-xl">
          {name}
        </h1>
        <p className="dark:text-dark-subtle text-light-subtle">{about}</p>
      </div>
    </ModalContainer>
  );
}
