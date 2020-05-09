import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { residents } from "./contents";

const Hero = () => <></>;

const Poem = () => <></>;

const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="row">{children}</section>
);

const Header = ({ children }: { children: React.ReactNode }) => (
  <h3>{children}</h3>
);

const TextBlock = ({ children }: { children: React.ReactNode }) => (
  <div className="textblock">{children}</div>
);

const LinkList = ({ items }: { items: { [name: string]: string } }) => (
  <ul>
    {Object.entries(items).map(([name, link]) => (
      <li key={name}>
        <a href={link} title={name}>
          {name}
        </a>
      </li>
    ))}
  </ul>
);

const About = () => (
  <div className="contents">
    <Hero />
    <Container className="body1">
      <Row>
        <Col lg={1} sm={0} />
        <Col lg={5} sm={12}>
          <Section>
            <Header>About ITP & Thesis</Header>
            <TextBlock>
              <p>
                ITP is a two-year graduate program located in the Tisch School
                of the Arts at New York University whose mission is to explore
                the imaginative uses of media and technology — how they might
                augment, improve and bring delight and art into people’s lives.
                Perhaps the best way to describe us is a Center for the Recently
                Possible.
              </p>

              <p>
                The ITP Thesis is just one semester long and is taught as a
                class within the two-year period. It is the one class in which
                students work individually (i.e. not part of a team) and develop
                a project or their own choosing from concept to a
                proof-of-concept prototype.
              </p>

              <p>
                The goal of an ITP education is that students leave here with
                the tools to do whatvever they want to do. Those tools include:
                knowing how to find out what they don’t know; to be ready for
                change, anticipate it; a willingness to experiment, fail, try
                again, etc; how to take an idea and make it real; to find their
                own strengths and deepen them; to follow your passions and trust
                their gut.
              </p>

              <p>
                The faculty needs to see evidence both of mastery of these tools
                or qualities and of specific skills they have learned in their
                two years in the program.
              </p>
            </TextBlock>
          </Section>
          <Section>
            <Header>About the Thesis Archive</Header>
            <TextBlock>
              The Thesis Archive is a place for graduate students of ITP to
              showcase their projects. This years site was created designed,
              conceptualized, and built by ITP residents Ilana Bonder, Dan Oved
              and Yang Yang, with production support by Erik Van Zummerman.
            </TextBlock>
          </Section>
          <Section>
            <Header>Thesis Advisors</Header>
            <TextBlock>
              <ul>
                <li>Nancy Hechinger</li>
                <li>Sarah Rothberg</li>
                <li>Kathleen Wilson</li>
                <li>Gabe Barcia-Colombo</li>
                <li>Zoe Fraade-Blanar</li>
                <li>Stefani Bardin</li>
                <li>Mimi O</li>
                <li>Nancy Hechinger</li>
                <li>Allison Parrish</li>
              </ul>
            </TextBlock>
          </Section>
          <Section>
            <Header>Full-Time Faculty</Header>
            <TextBlock>{/* ToDo: Scrape! */}</TextBlock>
          </Section>
          <Section>
            <Header>Research Residents</Header>
            <TextBlock>
              <LinkList items={residents} />
            </TextBlock>
          </Section>
          <Section>
            <Header>Staff and Admin</Header>
            {/* ToDo: Scrape!*/}
          </Section>
        </Col>
        <Col lg={5} sm={12}>
          <Poem />
        </Col>
      </Row>
    </Container>
  </div>
);

export default About;
