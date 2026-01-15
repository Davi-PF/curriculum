import { render, screen } from '@testing-library/react';
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
        label: 'Repositório',
        url: 'https://github.com/test',
      },
    ],
  });

  render(<ExperienceActivityItem activity={activity} />);

  const link = screen.getByRole('link', {
    name: /título da atividade github/i,
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
});
