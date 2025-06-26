
import {
	Box,
	Button,
	CircularProgress,
	CircularProgressLabel,
	Flex,
	Grid,
	Icon,
	Progress,
	SimpleGrid,
	Spacer,
	Stack,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr
} from '@chakra-ui/react';
// Styles for the circular progressbar
import medusa from 'assets/img/cardimgfree.png';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import BarChart from 'components/Charts/BarChart';
import LineChart from 'components/Charts/LineChart';
import IconBox from 'components/Icons/IconBox';
// Icons
import { CartIcon, DocumentIcon, GlobeIcon, RocketIcon, StatsIcon, WalletIcon } from 'components/Icons/Icons.js';
import DashboardTableRow from 'components/Tables/DashboardTableRow';
import TimelineRow from 'components/Tables/TimelineRow';
import React from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BiHappy } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { IoCheckmarkDoneCircleSharp, IoEllipsisHorizontal } from 'react-icons/io5';
// Data
import {
	barChartDataDashboard,
	barChartOptionsDashboard,
	lineChartDataDashboard,
	lineChartOptionsDashboard
} from 'variables/charts';
import { dashboardTableData, timelineData } from 'variables/general';

export default function Dashboard() {
	return (
		<Flex flexDirection='column' pt={{ base: '120px', md: '75px' }}>
			{/* <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px'>
				
				<Card>
					<CardBody>
						<Flex flexDirection='row' align='center' justify='center' w='100%'>
							<Stat me='auto'>
								<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
									Today's Money
								</StatLabel>
								<Flex>
									<StatNumber fontSize='lg' color='#fff'>
										$53,000
									</StatNumber>
									<StatHelpText
										alignSelf='flex-end'
										justifySelf='flex-end'
										m='0px'
										color='green.400'
										fontWeight='bold'
										ps='3px'
										fontSize='md'>
										+55%
									</StatHelpText>
								</Flex>
							</Stat>
							<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
								<WalletIcon h={'24px'} w={'24px'} color='#fff' />
							</IconBox>
						</Flex>
					</CardBody>
				</Card>
				
				<Card minH='83px'>
					<CardBody>
						<Flex flexDirection='row' align='center' justify='center' w='100%'>
							<Stat me='auto'>
								<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
									Today's Users
								</StatLabel>
								<Flex>
									<StatNumber fontSize='lg' color='#fff'>
										2,300
									</StatNumber>
									<StatHelpText
										alignSelf='flex-end'
										justifySelf='flex-end'
										m='0px'
										color='green.400'
										fontWeight='bold'
										ps='3px'
										fontSize='md'>
										+5%
									</StatHelpText>
								</Flex>
							</Stat>
							<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
								<GlobeIcon h={'24px'} w={'24px'} color='#fff' />
							</IconBox>
						</Flex>
					</CardBody>
				</Card>
				
				<Card>
					<CardBody>
						<Flex flexDirection='row' align='center' justify='center' w='100%'>
							<Stat>
								<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
									New Clients
								</StatLabel>
								<Flex>
									<StatNumber fontSize='lg' color='#fff'>
										+3,020
									</StatNumber>
									<StatHelpText
										alignSelf='flex-end'
										justifySelf='flex-end'
										m='0px'
										color='red.500'
										fontWeight='bold'
										ps='3px'
										fontSize='md'>
										-14%
									</StatHelpText>
								</Flex>
							</Stat>
							<Spacer />
							<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
								<DocumentIcon h={'24px'} w={'24px'} color='#fff' />
							</IconBox>
						</Flex>
					</CardBody>
				</Card>
				
				<Card>
					<CardBody>
						<Flex flexDirection='row' align='center' justify='center' w='100%'>
							<Stat me='auto'>
								<StatLabel fontSize='sm' color='gray.400' fontWeight='bold' pb='2px'>
									Total Sales
								</StatLabel>
								<Flex>
									<StatNumber fontSize='lg' color='#fff' fontWeight='bold'>
										$173,000
									</StatNumber>
									<StatHelpText
										alignSelf='flex-end'
										justifySelf='flex-end'
										m='0px'
										color='green.400'
										fontWeight='bold'
										ps='3px'
										fontSize='md'>
										+8%
									</StatHelpText>
								</Flex>
							</Stat>
							<IconBox as='box' h={'45px'} w={'45px'} bg='brand.200'>
								<CartIcon h={'24px'} w={'24px'} color='#fff' />
							</IconBox>
						</Flex>
					</CardBody>
				</Card>
			</SimpleGrid> */}
			<Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', '2xl': '2fr 1.2fr 1.5fr' }} my='26px' gap='18px'>
				{/* Welcome Card */}
				<Card
					p='0px'
					gridArea={{ md: '1 / 1 / 2 / 3', '2xl': 'auto' }}
					bgImage={medusa}
					bgSize='cover'
					bgPosition='50%'>
					<CardBody w='100%' h='100%'>
						<Flex flexDirection={{ sm: 'column', lg: 'row' }} w='100%' h='100%'>
							<Flex flexDirection='column' h='100%' p='22px' minW='60%' lineHeight='1.6'>
								<Text fontSize='sm' color='gray.400' fontWeight='bold'>
									Welcome back,
								</Text>
								<Text fontSize='28px' color='#fff' fontWeight='bold' mb='18px'>
									Mark Johnson
								</Text>
								<Text fontSize='md' color='gray.400' fontWeight='normal' mb='auto'>
									Glad to see you again! <br />
									Ask me anything.
								</Text>
								<Spacer />
								<Flex align='center'>
									<Button
										p='0px'
										variant='no-hover'
										bg='transparent'
										my={{ sm: '1.5rem', lg: '0px' }}>
										<Text
											fontSize='sm'
											color='#fff'
											fontWeight='bold'
											cursor='pointer'
											transition='all .3s ease'
											my={{ sm: '1.5rem', lg: '0px' }}
											_hover={{ me: '4px' }}>
											Tab to record
										</Text>
										<Icon
											as={BsArrowRight}
											w='20px'
											h='20px'
											color='#fff'
											fontSize='2xl'
											transition='all .3s ease'
											mx='.3rem'
											cursor='pointer'
											pt='4px'
											_hover={{ transform: 'translateX(20%)' }}
										/>
									</Button>
								</Flex>
							</Flex>
						</Flex>
					</CardBody>
				</Card>
				{/* Satisfaction Rate */}
				<Card gridArea={{ md: '2 / 1 / 3 / 2', '2xl': 'auto' }}>
					<CardHeader mb='24px'>
						<Flex direction='column'>
							<Text color='#fff' fontSize='lg' fontWeight='bold' mb='4px'>
								Satisfaction Rate
							</Text>
							<Text color='gray.400' fontSize='sm'>
								From all projects
							</Text>
						</Flex>
					</CardHeader>
					<Flex direction='column' justify='center' align='center'>
						<Box zIndex='-1'>
							<CircularProgress
								size={200}
								value={80}
								thickness={6}
								color='#582CFF'
								variant='vision'
								rounded>
								<CircularProgressLabel>
									<IconBox mb='20px' mx='auto' bg='brand.200' borderRadius='50%' w='48px' h='48px'>
										<Icon as={BiHappy} color='#fff' w='30px' h='30px' />
									</IconBox>
								</CircularProgressLabel>
							</CircularProgress>
						</Box>
						<Stack
							direction='row'
							spacing={{ sm: '42px', md: '68px' }}
							justify='center'
							maxW={{ sm: '270px', md: '300px', lg: '100%' }}
							mx={{ sm: 'auto', md: '0px' }}
							p='18px 22px'
							bg='linear-gradient(126.97deg, rgb(6, 11, 40) 28.26%, rgba(10, 14, 35) 91.2%)'
							borderRadius='20px'
							position='absolute'
							bottom='5%'>
							<Text fontSize='xs' color='gray.400'>
								0%
							</Text>
							<Flex direction='column' align='center' minW='80px'>
								<Text color='#fff' fontSize='28px' fontWeight='bold'>
									95%
								</Text>
								<Text fontSize='xs' color='gray.400'>
									Based on likes
								</Text>
							</Flex>
							<Text fontSize='xs' color='gray.400'>
								100%
							</Text>
						</Stack>
					</Flex>
				</Card>
				{/* Referral Tracking */}
				{/* <Card gridArea={{ md: '2 / 2 / 3 / 3', '2xl': 'auto' }}>
					<Flex direction='column'>
						<Flex justify='space-between' align='center' mb='40px'>
							<Text color='#fff' fontSize='lg' fontWeight='bold'>
								Referral Tracking
							</Text>
							<Button borderRadius='12px' w='38px' h='38px' bg='#22234B' _hover='none' _active='none'>
								<Icon as={IoEllipsisHorizontal} color='#7551FF' />
							</Button>
						</Flex>
						<Flex direction={{ sm: 'column', md: 'row' }}>
							<Flex direction='column' me={{ md: '6px', lg: '52px' }} mb={{ sm: '16px', md: '0px' }}>
								<Flex
									direction='column'
									p='22px'
									pe={{ sm: '22e', md: '8px', lg: '22px' }}
									minW={{ sm: '220px', md: '140px', lg: '220px' }}
									bg='linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)'
									borderRadius='20px'
									mb='20px'>
									<Text color='gray.400' fontSize='sm' mb='4px'>
										Invited
									</Text>
									<Text color='#fff' fontSize='lg' fontWeight='bold'>
										145 people
									</Text>
								</Flex>
								<Flex
									direction='column'
									p='22px'
									pe={{ sm: '22px', md: '8px', lg: '22px' }}
									minW={{ sm: '170px', md: '140px', lg: '170px' }}
									bg='linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)'
									borderRadius='20px'>
									<Text color='gray.400' fontSize='sm' mb='4px'>
										Bonus
									</Text>
									<Text color='#fff' fontSize='lg' fontWeight='bold'>
										1,465
									</Text>
								</Flex>
							</Flex>
							<Box mx={{ sm: 'auto', md: '0px' }}>
								<CircularProgress
									size={window.innerWidth >= 1024 ? 200 : window.innerWidth >= 768 ? 170 : 200}
									value={70}
									thickness={6}
									color='#05CD99'
									variant='vision'>
									<CircularProgressLabel>
										<Flex direction='column' justify='center' align='center'>
											<Text color='gray.400' fontSize='sm'>
												Safety
											</Text>
											<Text
												color='#fff'
												fontSize={{ md: '36px', lg: '50px' }}
												fontWeight='bold'
												mb='4px'>
												9.3
											</Text>
											<Text color='gray.400' fontSize='sm'>
												Total Score
											</Text>
										</Flex>
									</CircularProgressLabel>
								</CircularProgress>
							</Box>
						</Flex>
					</Flex>
				</Card>
			</Grid>
			<Grid
				templateColumns={{ sm: '1fr', lg: '1.7fr 1.3fr' }}
				maxW={{ sm: '100%', md: '100%' }}
				gap='24px'
				mb='24px'>
				{/* Sales Overview */}
			</Grid>
			
		</Flex>
	);
}
