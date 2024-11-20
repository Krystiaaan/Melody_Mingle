import { Box, Flex, Text, Icon } from "@chakra-ui/react"
import { CheckIcon } from '@chakra-ui/icons'
import { GenreButtonProps } from '../../interfaces/GenreButton.Interface'

export const GenreButton: React.FC<GenreButtonProps> = ({ icon, genreName, isSelected, onClick }) => {
    return (
        <Box
            position="relative"
            width="8em"
            height="8em"
            onClick={onClick}
            cursor="pointer"
            data-cy={`genre-${genreName}`}
        >
            <Box
                bgImage={`url(${icon})`}
                backgroundSize="8em"
                backgroundRepeat="no-repeat"
                width="100%"
                height="100%"
                borderRadius="2em"
                borderColor="mingle.darkPurple"
                borderWidth="0.3em"
                filter={isSelected ? 'blur(2px)' : 'none'}
            />
            <Flex
                marginTop="6.5em"
                width="7em"
                bg="mingle.specialPurple"
                justifyContent="center"
                borderRadius="0.25em"
                position="absolute"
                bottom="0"
                left="50%"
                transform="translateX(-50%)"
            >
                <Text fontSize="1xl" color="mingle.darkPurple" fontWeight="bold">
                    {genreName}
                </Text>
            </Flex>
            {isSelected && (
                <Icon
                    as={CheckIcon}
                    position="absolute"
                    top="2.25em"
                    right="2.25em"
                    color="red.500"
                    boxSize="3em"
                />
            )}
        </Box>
    )
}
