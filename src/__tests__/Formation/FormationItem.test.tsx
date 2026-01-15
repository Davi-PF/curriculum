import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { FormationItem } from '../../components/Formation/FormationItem';

vi.mock('../../components/ExpandableText/ExpandableText', () => ({
  ExpandableText: (props: { text: string; clampLines?: number; className?: string }) => (
    <p
      data-testid="expandable-text"
      data-clamplines={String(props.clampLines ?? '')}
      className={props.className}
    >
      {props.text}
    </p>
  ),
}));

describe('FormationItem', () => {
  it('renderiza período, título e instituição', () => {
    const item = {
      id: '1',
      period: '2020 - 2022',
      title: 'Análise e Desenvolvimento de Sistemas',
      institution: 'Universidade X',
    };

    render(<FormationItem item={item} />);

    expect(screen.getByText('2020 - 2022')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Análise e Desenvolvimento de Sistemas'
    );
    expect(screen.getByText('Universidade X')).toBeInTheDocument();
  });

  it('não renderiza ExpandableText quando não existe description', () => {
    const item = {
      id: '1',
      period: '2020 - 2022',
      title: 'Curso X',
      institution: 'Instituição Y',
    };

    render(<FormationItem item={item} />);

    expect(screen.queryByTestId('expandable-text')).not.toBeInTheDocument();
  });

  it('renderiza ExpandableText quando existe description e passa clampLines=2', () => {
    const item = {
      id: '1',
      period: '2020 - 2022',
      title: 'Curso X',
      institution: 'Instituição Y',
      description: 'Texto de descrição que deve ir para o ExpandableText.',
    };

    render(<FormationItem item={item} />);

    const expandable = screen.getByTestId('expandable-text');
    expect(expandable).toBeInTheDocument();
    expect(expandable).toHaveTextContent(
      'Texto de descrição que deve ir para o ExpandableText.'
    );
    expect(expandable).toHaveAttribute('data-clamplines', '2');
  });
});
