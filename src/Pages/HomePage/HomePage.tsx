import React, { useEffect, useState } from 'react';
import { AddPostDto, ListElementPostDto, PostDto, PostQueryObject, UpdatePostDto } from '../../Dtos/PostDto';
import PostCard from '../../Components/PostCard/PostCard';
import { addPostAPI, getAllPostsAPI, updatePostAPI } from '../../Services/PostService';
import { useNavigate } from 'react-router';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { useAuth } from '../../Context/useAuth';
import { AddButton, DeleteButton, UpdateButton } from '../../Components/Buttons/Buttons';
import Modal from '../../Components/Modal/Modal';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import { getAllMinimalTransfersAPI } from '../../Services/TransferService';
import { MinimalTransferDto } from '../../Dtos/TransferDto';
import { MinimalTransferRumourDto } from '../../Dtos/TransferRumourDto';
import { getAllMinimalTransferRumoursAPI } from '../../Services/TransferRumourService';
import SearchForm from '../../Components/SearchForm/SearchForm';
import * as Yup from "yup";
import { toast } from 'react-toastify';

const createPostFieldsConfig = (
  transfers: { transferId: string; name: string }[], 
  transferRumours: { transferRumourId: string; name: string }[]
) => {
  return [
      {
          name: 'title',
          label: 'Title',
          type: 'input' as const,
          placeholder: 'Enter post title',
      },
      {
          name: 'content',
          label: 'Content',
          type: 'input' as const,
          placeholder: 'Enter post content',
      },
      {
          name: 'createdOn',
          label: 'Created On',
          type: 'date' as const,
          placeholder: 'Select post creation date',
          inputType: 'date' as const,
      },
      {
          name: 'createdOnComparison',
          label: 'Created On Comparison',
          type: 'select' as const,
          placeholder: 'Select comparison for date',
          options: [
              { label: 'Greater than', value: 'gt' },
              { label: 'Greater equal', value: 'ge' },
              { label: 'Less than', value: 'lt' },
              { label: 'Less equal', value: 'le' },
              { label: 'Equal to', value: 'eq' },
          ],
      },
      {
          name: 'transferId',
          label: 'Transfer',
          type: 'select' as const,
          placeholder: 'Select transfer',
          options: transfers.map((transfer) => ({
              label: transfer.name,
              value: transfer.transferId,
          })),
      },
      {
          name: 'filterForEmptyTransferIfEmpty',
          label: 'Without Transfer?',
          type: 'checkbox' as const,
          defaultValue: false,
      },
      {
          name: 'transferRumourId',
          label: 'Transfer Rumour',
          type: 'select' as const,
          placeholder: 'Select transfer rumour',
          options: transferRumours.map((rumour) => ({
              label: rumour.name,
              value: rumour.transferRumourId,
          })),
      },
      {
          name: 'filterForEmptyTransferRumourIfEmpty',
          label: 'Without Transfer Rumour?',
          type: 'checkbox' as const,
          defaultValue: false,
      },
      {
          name: 'sortBy',
          label: 'Sort by',
          type: 'select' as const,
          placeholder: 'Choose sorting field',
          options: [
              { label: 'Created On', value: 'createdOn' },
              { label: 'Title', value: 'title' },
          ],
          defaultValue: "createdOn"
      },
      {
          name: 'isDescending',
          label: 'Sort Order',
          type: 'select' as const,
          placeholder: 'Select sorting order',
          options: [
              { label: 'Ascending', value: 'asc' },
              { label: 'Descending', value: 'desc' },
          ],
          defaultValue: 'desc',
      },
  ];
};

const createAddPostFieldsConfig = (
  transfers: { transferId: string; name: string }[],
  transferRumours: { transferRumourId: string; name: string }[]
): FormField[] => {
  return [
      {
          name: "title",
          label: "Title",
          initialValue: "",
          type: "text",
          validationSchema: Yup.string()
              .required("Title is required")
              .min(3, "Title can't be shorter than 3 characters")
              .max(100, "Title can't be longer than 100 characters"),
      },
      {
          name: "content",
          label: "Content",
          initialValue: "",
          type: "textarea",
          validationSchema: Yup.string().required("Content is required").min(5, "Content can't be shorter than 5 characters").max(500, "Content can't be longer than 500 characters"),
      },
      { name: "image", label: "Image", initialValue: null, type: "file"},
      {
          name: "transferId",
          label: "Transfer",
          initialValue: "",
          type: "select",
          options: transfers.map((transfer) => ({
              label: transfer.name,
              value: transfer.transferId,
          })),
          validationSchema: Yup.string().nullable(),
      },
      {
          name: "transferRumourId",
          label: "Transfer Rumour",
          initialValue: "",
          type: "select",
          options: transferRumours.map((rumour) => ({
              label: rumour.name,
              value: rumour.transferRumourId,
          })),
          validationSchema: Yup.string().nullable(),
      },
  ];
};


const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<ListElementPostDto[]>([]);
    const [minTransfers, setMinTransfers] = useState<{ transferId: string; name: string }[]>([]);
    const [minTransferRumours, setMinTransferRumours] = useState<{ transferRumourId: string; name: string }[]>([]);
    const [currentPostId, setCurrentPostId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const { logoutUser, IsAdmin, IsJournalist, user } = useAuth();
    const errorHandler = new ErrorHandler(logoutUser);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchPosts = async () => {
            const searchDto: PostQueryObject = {
                title: undefined,
                content: undefined,
                createdOn: undefined,
                createdOnComparison: 'eq',
                createdByUserId: undefined,
                transferId: undefined,
                filterForEmptyTransferIfEmpty: false,
                transferRumourId: undefined,
                filterForEmptyTransferRumourIfEmpty: false,
                sortBy: 'createdOn',
                isDescending: true,
                pageNumber: pageNumber,
                pageSize: pageSize,
            };
            try {
                const response = await getAllPostsAPI(searchDto);
                setPosts(response.data.items);
                setTotalCount(response.data.totalCount);
            } catch (e: any) {
                errorHandler.handle(e);
                setPosts([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        };
      setLoading(false);
          const fetchTransfers = async () => {
              try {
                  const transfersData = await getAllMinimalTransfersAPI();
                  setMinTransfers(transfersData.data.map((transfer) => ({
                      transferId: transfer.transferId.toString(),
                      name: `${transfer.player.firstName.slice(0,1)}. ${transfer.player.lastName}, ${transfer.buyingClub ? transfer.buyingClub.shortName : "FA"} -> ${transfer.sellingClub ? transfer.sellingClub.shortName : "FA"}`,
                  })));
              } catch (e: any) {
                  errorHandler.handle(e);
              }
          };
  
          const fetchTransferRumours = async () => {
            try {
              const transferRumoursData = await getAllMinimalTransferRumoursAPI();
              setMinTransferRumours(transferRumoursData.data.map((transferRumour) => ({
                  transferRumourId: transferRumour.transferRumourId.toString(),
                  name: `${transferRumour.player.firstName.slice(0,1)}. ${transferRumour.player.lastName}, ${transferRumour.buyingClub ? transferRumour.buyingClub.shortName : "FA"} -> ${transferRumour.sellingClub ? transferRumour.sellingClub.shortName : "FA"}`,
              })));
            } catch (e: any) {
                errorHandler.handle(e);
            }
          }
          fetchPosts();
          fetchTransfers();
          fetchTransferRumours();
    }, [pageNumber, pageSize]);

  const handleAdd = () => {
    setIsModalOpen(true);
};

  const handleDelete = (postId: number) => {
      console.log('Deleting post with id', postId);
  };

  const handleSearch = async (values: any) => {
      const searchDto: PostQueryObject = {
          title: values.title,
          content: values.content,
          createdOn: values.createdOn,
          createdOnComparison: values.createdOnComparison,
          transferId: values.transferId,
          filterForEmptyTransferIfEmpty: values.filterForEmptyTransferIfEmpty,
          transferRumourId: values.transferRumourId,
          filterForEmptyTransferRumourIfEmpty: values.filterForEmptyTransferRumourIfEmpty,
          sortBy: values.sortBy,
          isDescending: values.sortOrder === 'desc' ? true : false,
          pageSize: pageSize,
          pageNumber: pageNumber
      };

      try {
          const posts = await getAllPostsAPI(searchDto);
          setPosts(posts.data.items);
          setTotalCount(posts.data.totalCount);
      } catch (e: any) {
          errorHandler.handle(e);
          console.log(e);
          setPosts([]);
          setTotalCount(0);
      }    
  };
  const handleAddSubmit = async (addedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
    const addPostDto: AddPostDto = {
        title: addedFields.title as string,
        content: addedFields.content as string,
        image: addedFields.image as File,
        transferId: addedFields.transferId !== '' ? addedFields.transferId as number : null,
        transferRumourId: addedFields.transferRumourId !== '' ? addedFields.transferRumourId as number : null,
    };
    try{
        const response = await addPostAPI(addPostDto);
        toast.success("Post has been added!");
    }catch(e: any){
      errorHandler.handle(e);
    }finally{
        setIsModalOpen(false);
    }  
}


    if (loading) return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">Loading posts...</p>;
    const fields = createPostFieldsConfig(minTransfers, minTransferRumours);
    const addPostFields = createAddPostFieldsConfig(minTransfers, minTransferRumours);
    
    const totalPages = Math.ceil(totalCount / pageSize);    
    return (
      <>
        <div>
          <SearchForm fields={fields} onSubmit={handleSearch} 
                                totalPages={totalPages}
                                currentPage={pageNumber}
                                onPageChange={setPageNumber}
            />
        </div>
        {IsAdmin() || IsJournalist() ? (
              <div className="fixed bottom-4 left-4 z-50">
                  <AddButton onClick={handleAdd} label="Add New Post"/>
              </div>
          ) : null}

        {posts.length === 0 ? (
                <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                No posts found.
              </p>
            ) : (
              <div className="flex flex-col items-center">
              {posts.map((post, index) => (
                  <PostCard
                      key={post.postId}
                      post={post}
                      isAlignedLeft={index % 2 !== 0}
                  >
    
                  </PostCard>
              ))}
            </div>
            )}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <GenericForm fields={addPostFields} onSubmit={handleAddSubmit} />
        </Modal>
      </>

    );
};

export default HomePage;
