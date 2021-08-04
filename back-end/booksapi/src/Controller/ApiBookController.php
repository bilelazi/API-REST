<?php


namespace App\Controller;

use App\Entity\Book;
use App\Repository\BookRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

class ApiBookController extends AbstractController
{
    /**
     * @Route("/api/book", name="api_book_index", methods={"GET"})
     */
    public function index( BookRepository $bookrepository  ): Response
    {
        return $this->json($bookrepository->findall(),200,[]);
            
    }

    /**
     * @Route("/api/book/new", name="api_book_new", methods={"POST"})
     */
    public function create( Request $request , SerializerInterface $serializer , EntityManagerInterface $em , ValidatorInterface $validator ): Response
    {
        $jsonRecu = $request-> getContent();
        try{
        $book = $serializer->deserialize($jsonRecu, Book::class ,'json');

        $errors=$validator->validate($book);

        if(count($errors) > 0){
            return $this->json(error , 400);
        }

        $em->persist($book);
        $em->flush();
        
        return $this->json($book,200,[]);
        
        }catch(NotEncodableValueException $e) {
            return $this-> json([
                'status'=> 400,
                'message'=>$e->getMessage()
            ],400);
        } 
    }
}
