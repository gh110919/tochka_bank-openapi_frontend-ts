import { parse } from "qs";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../utils/api";
import styled from "styled-components";

type TQueryObject = {
  "?code": string;
  state: string;
  id_token: string;
};

export type TJsonObject = {
  client_id: string;
  client_secret: string;
};

type TToken = { token: string };

export const RequestSignPermissions = () => {
  const ls = localStorage.getItem("access_token_hybrid");

  const [stateATH, setATHState] = useState<TToken>(
    JSON.parse(ls !== null ? ls : "{}") as TToken
  );

  const { search } = useLocation();

  const { "?code": code, state } = parse(search) as TQueryObject;

  const { client_id, client_secret } = JSON.parse(state) as TJsonObject;

  useEffect(() => {
    if (client_id && client_secret) {
      api
        .post("/exchange_code_access", {
          client_id,
          client_secret,
          code,
        })
        .then((r) => {
          const {
            success,
            message: { refresh_token },
          } = r.data;

          if (success) {
            api
              .post("/exchange_refresh_token", {
                client_id,
                client_secret,
                refresh_token,
              })
              .then((r) => {
                const {
                  success,
                  message: { access_token },
                } = r.data;

                if (success) {
                  api
                    .post("/check_access_token", { access_token })
                    .then((r) => {
                      const { success, message } = r.data;
                      console.log('r.data', r.data)

                      if (success) {
                        localStorage.setItem(
                          "access_token_hybrid",
                          JSON.stringify({ token: message })
                        );

                        setATHState({ token: message });
                      }
                    })
                    .catch(console.error);
                }
              })
              .catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, []);

  return (
    <Container>
      <h1>Access Token Hybrid</h1>
      <Text>{stateATH.token}</Text>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Text = styled.p`
  width: 50vh;
  word-wrap: break-word;
  user-select: text;
`;
