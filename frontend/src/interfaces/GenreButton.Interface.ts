export interface GenreButtonProps {
  icon: string; // URL to the icon image
  genreName: string; // Name of the genre
  isSelected: boolean; // Indicates if the genre is selected
  onClick: () => void; // Click handler for the genre button
}
