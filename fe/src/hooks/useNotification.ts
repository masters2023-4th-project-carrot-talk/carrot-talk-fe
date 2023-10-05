import { END_POINT } from '@constants/path';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useEffect, useRef } from 'react';
import { getAccessToken } from '@utils/localStorage';
import {
  useNotificationStore,
  useUnreadTotalCountStore,
} from '@stores/notificationStore';
import { EVENT_NAME } from '@constants/eventName';

export const useNotification = (isLogin: boolean) => {
  const { setShouldNotify } = useNotificationStore();
  const { addUnreadTotalCount } = useUnreadTotalCountStore();

  const EventSource = EventSourcePolyfill;
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    console.log(isLogin, ': isLogin');

    if (!isLogin) return;

    const connectSSE = () => {
      try {
        eventSourceRef.current = new EventSource(
          `${import.meta.env.VITE_BASE_URL}${END_POINT.notify}`,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },

            withCredentials: true,
            heartbeatTimeout: 600000,
          },
        );

        eventSourceRef.current.addEventListener(
          EVENT_NAME.notification,
          (event) => {
            console.log('notification open??: ', event);
            addUnreadTotalCount(1);
          },
        );

        eventSourceRef.current.onmessage = (event) => {
          console.log('is connected?');
          console.log(event);
          const response = event.data;
          console.log('now noti response : ', response);

          setShouldNotify(true);

          if (response.includes(EVENT_NAME.notification)) {
            addUnreadTotalCount(1);
            // toast?
          }
        };

        eventSourceRef.current.onerror = (error) => {
          console.log('error on connect: ', error);
          // eventSourceRef.current?.close(); 여기서 닫으면 안됨
        };
      } catch (error) {
        console.log('notify error: ', error);
        return;
      }
    };

    connectSSE();

    return () => {
      console.log('disconnect');

      eventSourceRef.current?.close();

      setShouldNotify(false);
    };
  }, [isLogin, EventSource]);
};
