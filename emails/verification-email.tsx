import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Button,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
    token: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const VerificationEmail = ({ token }: VerificationEmailProps) => {
    const confirmLink = `${baseUrl}/auth/new-verification?token=${token}`;

    return (
        <Html>
            <Head />
            <Preview>Confirm your email address</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Confirm your email address</Heading>
                    <Text style={text}>
                        Start using our service by confirming your email address.
                    </Text>
                    <Section style={{ textAlign: "center", margin: "32px 0" }}>
                        <Button style={button} href={confirmLink}>
                            Click here to confirm email
                        </Button>
                    </Section>
                    <Text style={footer}>
                        If you didn't request this email, you can safely ignore it.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default VerificationEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
};

const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
};

const text = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "center" as const,
};

const button = {
    backgroundColor: "#000000",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "100%",
    padding: "12px",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
    textAlign: "center" as const,
    marginTop: "32px",
};
