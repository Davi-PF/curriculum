import { render, screen } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from "vitest";
import { translations } from "../../i18n";
import { useLanguage } from "../../contexts/LanguageContext";
import Formation from "../../components/Formation/Formation";

const mockedUseLanguage = useLanguage as MockedFunction<typeof useLanguage>;

vi.mock("../../contexts/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("../../data/education", () => ({
  educationByLanguage: {
    pt: [
      {
        id: "pt-1",
        period: "2020",
        title: "Formação PT",
        institution: "Instituição PT",
        description: "Descrição PT",
      },
    ],
    en: [
      {
        id: "en-1",
        period: "2021",
        title: "Formation EN",
        institution: "Institution EN",
        description: "Description EN",
      },
      {
        id: "en-2",
        period: "2022",
        title: "Another EN",
        institution: "Another Inst",
      },
    ],
  },
}));

vi.mock("../../components/Formation/FormationHeader", () => ({
  FormationHeader: () => <div data-testid="formation-header" />,
}));

vi.mock("../../components/Formation/FormationTimeline", () => ({
  FormationTimeline: ({
    education,
  }: {
    education: Array<{ id: string; title: string }>;
  }) => (
    <div data-testid="formation-timeline">
      {education.map((e) => (
        <span key={e.id}>{e.title}</span>
      ))}
    </div>
  ),
}));

describe("Formation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza o header e a timeline", () => {
    mockedUseLanguage.mockReturnValue({
      language: "pt",
      t: translations.pt,
      toggleLanguage: vi.fn(),
    });

    render(<Formation />);

    expect(screen.getByTestId("formation-header")).toBeInTheDocument();
    expect(screen.getByTestId("formation-timeline")).toBeInTheDocument();
  });

  it("passa o education correto quando language = pt", () => {
    mockedUseLanguage.mockReturnValue({
      language: "pt",
      t: translations.pt,
      toggleLanguage: vi.fn(),
    });

    render(<Formation />);

    // No mock da timeline, renderizamos os títulos recebidos
    expect(screen.getByTestId("formation-timeline")).toHaveTextContent(
      "Formação PT"
    );
    expect(screen.queryByText("Formation EN")).not.toBeInTheDocument();
  });

  it("passa o education correto quando language = en", () => {
    mockedUseLanguage.mockReturnValue({
      language: "en",
      t: translations.pt,
      toggleLanguage: vi.fn(),
    });

    render(<Formation />);

    expect(screen.getByTestId("formation-timeline")).toHaveTextContent(
      "Formation EN"
    );
    expect(screen.getByTestId("formation-timeline")).toHaveTextContent(
      "Another EN"
    );
    expect(screen.queryByText("Formação PT")).not.toBeInTheDocument();
  });
});
