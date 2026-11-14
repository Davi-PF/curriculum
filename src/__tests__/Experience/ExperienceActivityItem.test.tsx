import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ExperienceActivityItem } from '../../components/Experience/ExperienceActivityItem';
import { makeActivity } from '../factories/activityFactory';

describe('ExperienceActivityItem', () => {
  it('hides description for project variant on small screens', () => {
    const activity = makeActivity({
      links: [
        {
          type: 'github',
          label: 'Repo',
          url: 'https://github.com/test',
          variant: 'project',
        },
      ],
    });

    render(<ExperienceActivityItem activity={activity} />);

    const description = screen.getByText('Descrição da atividade');

    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('hidden');
  });

  it('renders activity title', () => {
    const activity = makeActivity({ title: 'Minha atividade' });

    render(<ExperienceActivityItem activity={activity} />);

    expect(screen.getByText('Minha atividade')).toBeInTheDocument();
  });

  it('renders activity link with correct href', () => {
    const activity = makeActivity({
      links: [
        {
          type: 'github',
          label: 'Repositorio',
          url: 'https://github.com/test',
        },
      ],
    });

    render(<ExperienceActivityItem activity={activity} />);

    const link = screen.getByRole('link', {
      name: /atividade/i,
    });

    expect(link).toHaveAttribute('href', 'https://github.com/test');
  });

  it('uses correct icon for github link', () => {
    const activity = makeActivity({
      links: [
        {
          type: 'github',
          label: 'GitHub',
          url: '#',
        },
      ],
    });

    render(<ExperienceActivityItem activity={activity} />);

    const image = screen.getByAltText(/github/i);
    expect(image).toHaveAttribute('src', expect.stringContaining('github'));
  });

  it('renders only the activity title and no links when links is undefined', () => {
    const activity = makeActivity({
      title: 'Atividade sem propriedade links',
      links: undefined,
    });

    render(<ExperienceActivityItem activity={activity} />);

    expect(screen.getByText('Atividade sem propriedade links')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders only the activity title and no links when links is an empty array', () => {
    const activity = makeActivity({
      title: 'Atividade com links vazios',
      links: [],
    });

    render(<ExperienceActivityItem activity={activity} />);

    expect(screen.getByText('Atividade com links vazios')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('renders all links in order with preserved labels, urls, security attrs and icons when multiple links exist', () => {
    const activity = makeActivity({
      title: 'Aplicativo de rastreio de dependente',
      description: 'Projeto com múltiplos repositórios e demonstração.',
      links: [
        {
          type: 'demo',
          label: 'Demo Vídeo',
          url: 'https://www.youtube.com/watch?v=FnB7Do6TG_Q',
          variant: 'project',
        },
        {
          type: 'github',
          label: 'Mobile Repo',
          url: 'https://github.com/Davi-PF/projeto-conclusao-curso-mobile',
          variant: 'project',
        },
        {
          type: 'github',
          label: 'Backend Repo',
          url: 'https://github.com/WesleySardi/2.1__Java__projeto-conclusao-curso-backend',
          variant: 'project',
        },
        {
          type: 'website',
          label: 'Website',
          url: 'https://example.com',
          variant: 'project',
        },
      ],
    });

    render(<ExperienceActivityItem activity={activity} />);

    expect(
      screen.getByText('Aplicativo de rastreio de dependente')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Projeto com múltiplos repositórios e demonstração.')
    ).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);

    expect(links.map((el) => el.getAttribute('href'))).toEqual([
      'https://www.youtube.com/watch?v=FnB7Do6TG_Q',
      'https://github.com/Davi-PF/projeto-conclusao-curso-mobile',
      'https://github.com/WesleySardi/2.1__Java__projeto-conclusao-curso-backend',
      'https://example.com',
    ]);

    expect(links[0]).toHaveTextContent('Demo Vídeo');
    expect(links[1]).toHaveTextContent('Mobile Repo');
    expect(links[2]).toHaveTextContent('Backend Repo');
    expect(links[3]).toHaveTextContent('Website');

    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }

    expect(screen.getByAltText('demo')).toHaveAttribute(
      'src',
      expect.stringContaining('icon-youtube')
    );
    expect(screen.getAllByAltText('github')).toHaveLength(2);
    expect(screen.getByAltText('website')).toHaveAttribute(
      'src',
      expect.stringContaining('globe.svg')
    );
  });

  it('ignores links with empty urls when rendering an activity', () => {
    const activity = makeActivity({
      title: 'Atividade com link inválido',
      links: [
        {
          type: 'website',
          label: 'Inválido',
          url: '   ',
        },
        {
          type: 'github',
          label: 'Repo Válido',
          url: 'https://github.com/test/valid',
        },
      ],
    });

    render(<ExperienceActivityItem activity={activity} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', 'https://github.com/test/valid');
  });

  it('trims leading and trailing whitespace from link urls before rendering href', () => {
    const activity = makeActivity({
      title: 'Atividade com URL com espaços',
      links: [
        {
          type: 'github',
          label: 'Repo',
          url: '   https://github.com/test/trimmed   ',
        },
      ],
    });

    render(<ExperienceActivityItem activity={activity} />);

    const link = screen.getByRole('link', { name: /atividade com url com espaços/i });
    expect(link).toHaveAttribute('href', 'https://github.com/test/trimmed');
  });

  it('renders duplicate links with identical type, label and url without React key collision', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      const activity = makeActivity({
        title: 'Atividade com links idênticos',
        links: [
          {
            type: 'github',
            label: 'Repo',
            url: 'https://github.com/test/same',
          },
          {
            type: 'github',
            label: 'Repo',
            url: 'https://github.com/test/same',
          },
        ],
      });

      render(<ExperienceActivityItem activity={activity} />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveAttribute('href', 'https://github.com/test/same');
      expect(links[1]).toHaveAttribute('href', 'https://github.com/test/same');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});
