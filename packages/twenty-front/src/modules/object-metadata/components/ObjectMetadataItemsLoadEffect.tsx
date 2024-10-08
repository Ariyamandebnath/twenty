import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { useIsLogged } from '@/auth/hooks/useIsLogged';
import { currentUserState } from '@/auth/states/currentUserState';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useFindManyObjectMetadataItems } from '@/object-metadata/hooks/useFindManyObjectMetadataItems';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { getObjectMetadataItemsMock } from '@/object-metadata/utils/getObjectMetadataItemsMock';
import { WorkspaceActivationStatus } from '~/generated/graphql';
import { isDeeplyEqual } from '~/utils/isDeeplyEqual';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';

export const ObjectMetadataItemsLoadEffect = () => {
  const currentUser = useRecoilValue(currentUserState);
  const currentWorkspace = useRecoilValue(currentWorkspaceState);
  const isLoggedIn = useIsLogged();

  const { objectMetadataItems: newObjectMetadataItems, loading } =
    useFindManyObjectMetadataItems({
      skip: !isLoggedIn,
    });

  const [objectMetadataItems, setObjectMetadataItems] = useRecoilState(
    objectMetadataItemsState,
  );

  useEffect(() => {
    const toSetObjectMetadataItems =
      isUndefinedOrNull(currentUser) ||
      currentWorkspace?.activationStatus !== WorkspaceActivationStatus.Active
        ? getObjectMetadataItemsMock()
        : newObjectMetadataItems;
    if (
      !loading &&
      !isDeeplyEqual(objectMetadataItems, toSetObjectMetadataItems)
    ) {
      setObjectMetadataItems(toSetObjectMetadataItems);
    }
  }, [
    currentUser,
    currentWorkspace?.activationStatus,
    loading,
    newObjectMetadataItems,
    objectMetadataItems,
    setObjectMetadataItems,
  ]);

  return <></>;
};
