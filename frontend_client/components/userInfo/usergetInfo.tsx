'use client';

import { useGetUserInfoQuery } from "@/redux/features/home/homeclientslice";


export default function GetUserinfo() {

  const { data, isLoading, isError } = useGetUserInfoQuery(undefined, {

    refetchOnMountOrArgChange: false, 
    refetchOnFocus: true,            
  });

  return null;
}