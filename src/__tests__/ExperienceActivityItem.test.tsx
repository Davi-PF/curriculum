import { render, screen } from '@testing-library/react';
import { ExperienceActivityItem } from '../components/Experience/ExperienceActivityItem';
import { makeActivity } from './factories/activityFactory';

describe('ExperienceActivityItem', () => {
  it('renders description hidden by default for project variant', () => {
  const activity = makeActivity({ variant: 'project' });

  render(<ExperienceActivityItem activity={activity} />);

  const description = screen.getByText('Descrição da atividade');

  expect(description).toBeInTheDocument();
  expect(description).toHaveClass('hidden');
});

});

it('renders activity title', () => {
  const activity = makeActivity({ title: 'Minha atividade' });

  render(<ExperienceActivityItem activity={activity} />);

  expect(
    screen.getByText('Minha atividade')
  ).toBeInTheDocument();
});

it('renders activity links', () => {
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

  expect(
    screen.getByRole('link', { name: /repositório/i })
  ).toHaveAttribute('href', 'https://github.com/test');
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
