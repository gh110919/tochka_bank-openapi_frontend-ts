import styled from "styled-components";

export const Index = () => {
  return (
    <Container>
      <div>
        <Link href="/get_token_permissions">
          Фронтенд алгоритма запроса oAuth 2.0 токена
        </Link>
      </div>
    </Container>
  );
};

const Container = styled.section`
  padding: 32px;
`;

const Link = styled.a`
  padding: 16px;
  outline: 1px solid red;
`;
