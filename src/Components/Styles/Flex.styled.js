import styled from "styled-components";

export const Flex = styled.div`
    display: flex;
    position: relative;
    flex-direction: ${({direction}) => direction || 'row'};
`