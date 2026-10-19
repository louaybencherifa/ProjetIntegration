import {
  executeMutation,
  executeQuery,
  getDataConnect,
  mutationRef,
  queryRef,
} from "firebase/data-connect";
import { firebaseApp } from "@/lib/firebase/client";

function getDataConnectConfig() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const location = process.env.NEXT_PUBLIC_DATA_CONNECT_LOCATION;
  const service = process.env.NEXT_PUBLIC_DATA_CONNECT_SERVICE;
  const connector = process.env.NEXT_PUBLIC_DATA_CONNECT_CONNECTOR;

  if (!projectId || !location || !service || !connector) {
    throw new Error(
      "Data Connect is not configured. Set NEXT_PUBLIC_DATA_CONNECT_LOCATION, NEXT_PUBLIC_DATA_CONNECT_SERVICE, and NEXT_PUBLIC_DATA_CONNECT_CONNECTOR.",
    );
  }

  return { projectId, location, service, connector };
}

export function dataConnect() {
  return getDataConnect(firebaseApp, getDataConnectConfig());
}

export async function runQuery<Data, Variables>(
  operation: string,
  variables: Variables,
) {
  const result = await executeQuery(
    queryRef<Data, Variables>(dataConnect(), operation, variables),
  );
  return result.data;
}

export async function runMutation<Data, Variables>(
  operation: string,
  variables: Variables,
) {
  const result = await executeMutation(
    mutationRef<Data, Variables>(dataConnect(), operation, variables),
  );
  return result.data;
}
