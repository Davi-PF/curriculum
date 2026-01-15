import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Ajuste o caminho conforme sua estrutura
import { FormationTimeline } from '../../components/Formation/FormationTimeline';

// Mock do FormationItem
vi.mock('../../components/Formation/FormationItem', () => ({
  FormationItem: ({ item }: { item: { id: string; title: string } }) => (
    <li data-testid="formation-item">{item.title}</li>
  ),
}));

describe('FormationTimeline', () => {
  it('renderiza uma lista ordenada (ol)', () => {
    render(<FormationTimeline education={[]} />);

    const list = screen.getByRole('list');
    expect(list.tagName.toLowerCase()).toBe('ol');
  });

  it('renderiza um FormationItem para cada item de education', () => {
    const education = [
      {
        id: '1',
        period: '2020 - 2022',
        title: 'Curso A',
        institution: 'Instituição A',
      },
      {
        id: '2',
        period: '2023',
        title: 'Curso B',
        institution: 'Instituição B',
      },
    ];

    render(<FormationTimeline education={education} />);

    const items = screen.getAllByTestId('formation-item');
    expect(items).toHaveLength(2);

    expect(items[0]).toHaveTextContent('Curso A');
    expect(items[1]).toHaveTextContent('Curso B');
  });

  it('renderiza lista vazia quando education é vazio', () => {
    render(<FormationTimeline education={[]} />);

    expect(screen.queryAllByTestId('formation-item')).toHaveLength(0);
  });
});
