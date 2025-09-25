import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrganization } from '../api/OrganizationSettings/organizationSettingsApi';

export function useCurrentOrganization() {
  const { data } = useQuery({
    queryKey: ['organization'],
    queryFn: getOrganization,
  });

  return {
    organizationName: data?.organizationName ?? 'Loading...',
    organizationLogo: data?.logoUrl?.signedUrl,
  };
}

export function OrganizationHeadSetter() {
  const { organizationName, organizationLogo } = useCurrentOrganization();
  
  useEffect(() => {
    document.title = organizationName;
    if (organizationLogo) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = organizationLogo;
    }
  }, [organizationName, organizationLogo]);
  
  return null;
}

