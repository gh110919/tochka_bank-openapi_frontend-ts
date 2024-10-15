import { FormEvent, useState } from "react";
import { styled } from "styled-components";
import { api } from "../utils/api";
import { TJsonObject } from "./request-sign-permissions";

export const GetTokenPermissions = () => {
  type State = {
    client_id: string;
    client_secret: string;
    redirect_url: string;
  };

  const ls = localStorage.getItem("gtp");

  const [state, setState] = useState<State>(
    JSON.parse(ls !== null ? ls : "{}") as State
  );

  const handleSubmitClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem("gtp", JSON.stringify(state));

    const { client_id, client_secret, redirect_url } = state;

    api
      .post("/get_token_permissions", {
        client_id,
        client_secret,
      })
      .then((r) => {
        const {
          success,
          message: { access_token, state },
        } = r.data;

        const { client_id, client_secret } = JSON.parse(state) as TJsonObject;

        if (success) {
          api
            .post("/set_permissions", {
              access_token,
              data: {
                Data: {
                  permissions: [
                    "ReadAccountsBasic",
                    "ReadAccountsDetail",
                    "MakeAcquiringOperation",
                    "ReadAcquiringData",
                    "ReadBalances",
                    "ReadStatements",
                    "ReadCustomerData",
                    "ReadSBPData",
                    "EditSBPData",
                    "CreatePaymentForSign",
                    "CreatePaymentOrder",
                    "ManageWebhookData",
                    "ManageInvoiceData",
                  ],
                },
              },
            })
            .then((r) => {
              const {
                success,
                message: {
                  Data: { consentId: consent_id },
                },
              } = r.data;

              if (success) {
                api
                  .post("/request_sign_permissions", {
                    redirect_url,
                    client_id,
                    client_secret,
                    consent_id,
                  })
                  .then((r) => {
                    const {
                      success,
                      message: { link },
                    } = r.data;

                    if (success) {
                      window.location.href = link;
                    }
                  })
                  .catch(console.error);
              }
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  };

  return (
    <section>
      <Form onSubmit={handleSubmitClick}>
        <Input
          type="text"
          placeholder="client_id"
          onChange={(e) =>
            setState((prev) => ({ ...prev!, client_id: e.target.value }))
          }
          value={state?.client_id}
        />
        <Input
          type="text"
          placeholder="client_secret"
          onChange={(e) =>
            setState((prev) => ({ ...prev!, client_secret: e.target.value }))
          }
          value={state?.client_secret}
        />
        <Input
          type="text"
          placeholder="redirect_url"
          onChange={(e) =>
            setState((prev) => ({ ...prev!, redirect_url: e.target.value }))
          }
          value={state?.redirect_url}
        />
        <Button type="submit">Отправить</Button>
      </Form>
    </section>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 32px;
  width: 50vh;
`;

const Input = styled.input`
  padding: 8px;
  width: 100%;
`;

const Button = styled.button`
  width: 100%;
  outline: 1px solid blue;
  padding: 8px;
`;
